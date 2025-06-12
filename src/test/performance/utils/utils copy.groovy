import groovy.json.JsonSlurper
import groovy.json.JsonOutput

// Performance in pipelines

//==========================================    
// Request to send dynatrace custom_info event
//==========================================    
def postDynatraceEvent(dynatraceApiHost, dynatraceSyntheticPerfTest, dynatraceDashboardId, dynatraceEntitySelector) {
    def response = null
    try {
    response = httpRequest(
        acceptType: 'APPLICATION_JSON',
        contentType: 'APPLICATION_JSON',
        httpMode: 'POST',
        quiet: true,
        customHeaders: [
            [name: 'Authorization', value: "Api-Token ${env.PERF_EVENT_TOKEN}"]
        ],
        url: "${dynatraceApiHost}api/v2/events/ingest",
        requestBody: """{
            "entitySelector": "${dynatraceEntitySelector}",
            "eventType": "CUSTOM_INFO",
            "properties": {
                "Workspace": "${env.WORKSPACE}",
                "Branch": "${env.BRANCH_NAME}",
                "Build Number": "${env.BUILD_NUMBER}",
                "Synthetic Performance Test": "${dynatraceSyntheticPerfTest}",
                "Performance Dashboard": "${dynatraceApiHost}#dashboard;id=${dynatraceDashboardId};applyDashboardDefaults=true"
            },
            "timeout": 1,
            "title": "ET-SYA-Frontend Performance Event"
        }"""
    )
    echo "Dynatrace event posted successfully. Response ${response}"
    } catch (Exception e)
    {
        echo "Failure posting Dynatrace Event: ${e.message}"
    }
    return response
}

//==========================================    
/// POST Metric to highlight a deployment
//==========================================
def postDynatraceMetric(dynatraceApiHost, dynatraceMetricIngestEndpoint, dynatraceMetricType, dynatraceMetricTag, environment) {
    def response = null
    try {
    response = httpRequest(
        acceptType: 'APPLICATION_JSON',
        contentType: 'TEXT_PLAIN',
        httpMode: 'POST',
        quiet: true,
        customHeaders: [
            [name: 'Authorization', value: "Api-Token ${env.PERF_METRICS_TOKEN}"]
        ],
        url: "${dynatraceApiHost}${dynatraceMetricIngestEndpoint}",
        requestBody: "env.release.value,type=${dynatraceMetricType},tag=${dynatraceMetricTag},env=${environment} 3"
    ) 
    echo "Dynatrace metric posted successfully. Response ${response}"
    } catch (Exception e)
    {
    echo "Failure posting Dynatrace Metric: ${e.message}"
    }
    return response
}

// //==========================================   
// //Trigger Dynatrace Synthetic Test
// //==========================================
def postDynatraceSyntheticTest(dynatraceApiHost, dynatraceTriggerSyntheticEndpoint,dynatraceSyntheticPerfTest) {
    def response = null
    try {
    response = httpRequest(
        acceptType: 'APPLICATION_JSON',
        contentType: 'APPLICATION_JSON',
        httpMode: 'POST',
        quiet: true,
        customHeaders: [
            [name: 'Authorization', value: "Api-Token ${env.PERF_SYNTHETIC_MONITOR_TOKEN}"]
        ],
        url: "${dynatraceApiHost}${dynatraceTriggerSyntheticEndpoint}",
        requestBody: """{
            "monitors": [
                {
                    "monitorId": "${dynatraceSyntheticPerfTest}"
                }
            ]
        }"""
    )
    echo "Dynatrace synthetic test triggered. Response ${response}"
    }
    catch (Exception e) {
        echo "Error while sending Request: ${e.message}"
    }
    
    echo "Raw JSON response:\n${response.content}"

    // Parse the JSON string into an object
    def json = new JsonSlurper().parseText(response.content)

    // Extract individual values
    def triggeredCount = json.triggeredCount
    def executedSynthetics = json.triggered[0].executions
    
    // Get last execution ID using index
    def selectedIndex = triggeredCount - 1
    def lastExecutionId = executedSynthetics[selectedIndex].executionId

    echo "Triggered Count: ${triggeredCount}"
    echo "Last Execution ID: ${lastExecutionId}"

    return [
        response: response,
        triggeredCount: triggeredCount,
        lastExecutionId: lastExecutionId
    ]
}

// //==========================================   
// //Check Status of Synthetic Test
// //==========================================
def getDynatraceSyntheticStatus(dynatraceApiHost, lastExecutionId) {
    def response = null
    try {
    response = httpRequest(
        acceptType: 'APPLICATION_JSON',
        contentType: 'APPLICATION_JSON',
        httpMode: 'GET',
        quiet: true,
        customHeaders: [
            [name: 'Authorization', value: "Api-Token ${env.PERF_SYNTHETIC_MONITOR_TOKEN}"]
        ],
        url: "${dynatraceApiHost}api/v2/synthetic/executions/${lastExecutionId}"
    )
    echo "Check Synthetic Status: Response ${response}"
    }
    catch (Exception e) {
        echo "Error while sending Request: ${e.message}"
    }
      echo "Raw JSON response:\n${response.content}"

    // Parse the JSON string into an object
    def json = new JsonSlurper().parseText(response.content)

    // Extract Status 
    def executionStatus = json.executionStage
        
    echo "Current Status: ${executionStatus}"
    return [
        response: response,
        executionStatus: executionStatus
    ]
}

// //==========================================   
// //Update Dynatrace Synthetic Test
// //==========================================
def putDynatraceSyntheticTest(dynatraceApiHost, dynatraceUpdateSyntheticEndpoint, dynatraceSyntheticPerftest, dynatraceSyntheticEnabled, previewUrl = "https://et-sya.DEFAULT.platform.hmcts.net/", dynatraceScriptName) {
    def response = null
    def dynatraceScript = null
    
    // Use JSON Object & JSON ECHO SERVER FOR DEBUG
    // //==========================================   
    // //GET Synthetic Info 
    // //==========================================
    try {
    response = httpRequest(
        acceptType: 'APPLICATION_JSON',
        contentType: 'APPLICATION_JSON',
        httpMode: 'GET',
        quiet: true,
        customHeaders: [
            [name: 'Authorization', value: "Api-Token ${env.PERF_SYNTHETIC_MONITOR_TOKEN}"]
        ],
        url: "${dynatraceApiHost}${dynatraceUpdateSyntheticEndpoint}${dynatraceSyntheticPerftest}"
    )
    echo "Check Synthetic Status: Response ${response}"
    }
    catch (Exception e) {
        echo "Error while sending Request: ${e.message}"
    }
      echo "Raw JSON response:\n${response.content}"

    // Parse the JSON string into an object
    def json = new JsonSlurper().parseText(response.content)

    //Edit the JSON
    json.enabled = "${dynatraceSyntheticEnabled}"
    json.script.events[0].url = "${previewUrl}" //https://et-sya.testURL1234.platform.hmcts.net/

    //Convert updated JSON to String:
    def modifiedRequestBody = JsonOutput.toJson(json)

    //PUT back to DT
    try {
    response = httpRequest(
        acceptType: 'APPLICATION_JSON',
        contentType: 'APPLICATION_JSON',
        httpMode: 'PUT',
        quiet: true,
        customHeaders: [
            [name: 'Authorization', value: "Api-Token ${env.PERF_SYNTHETIC_UPDATE_TOKEN}"]
        ],
        url: "${dynatraceApiHost}${dynatraceUpdateSyntheticEndpoint}${dynatraceSyntheticPerftest}",
        requestBody: "${modifiedRequestBody}"
    )
    echo "Dynatrace synthetic test updated. Response ${response}"
    }
    catch (Exception e) {
        echo "Error while updating synthetic in utils: ${e.message}"
        echo "response detail: ${response.content}"
    } 
}

return this



//Static vars
//dynatraceApiHost: "https://yrk32651.live.dynatrace.com/"
//dynatraceEventIngestEndpoint = "api/v2/events/ingest"

// //Vars for eventIngest
// def serviceType = "type(service)"
// def kubernetesNamespaceTag = "[Kubernetes]namespace:et"
// def environmentTag = "Environment:PERF"
// def entityId = "SERVICE-894163B308FBDD78"

// def entitySelector = "${serviceType},tag(\"${kubernetesNamespaceTag}\"),tag(\"${environmentTag}\"),entityId(\"${entityId}\")"

// //Object Maps
// // commonHeaders: [
    // // 'Content-Type': 'application/json'
// // ],

// eventIngestDetails: [
    // eventType: "CUSTOM_INFO",
    // timeout: 1,
    // title: "ET-SYA-Frontend Performance Event",
    // entitySelector: "${entitySelector}"
// ]


//  // Print the loaded config
//  echo "INSIDE CONFIG: Dynatrace API URL: ${env.dynatraceApiHost}"
//  //echo "Dynatrace Endpoint: ${config.dynatraceEventIngestEndpoint}"
//  //echo "Entity Selector: ${config.eventIngestDetails.entitySelector}"
//  //Load Config
//  //def config = load '.\src\test\performance\config\config.groovy'
//  // Accessing the entitySelector from the config map
//  echo "INSIDE CONFIG: Entity Selector: ${env.dynatraceEventIngestEndpoint}"


