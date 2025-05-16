// Performance in pipelines

// Request to send dynatrace custom_info event
def postDynatraceEvent(dynatraceApiHost, dynatraceSyntheticPerfTest, dynatraceDashboardId, dynatraceEntitySelector) {
    try {
        def response = httpRequest(
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
                "properties": "${dynatraceEntitySelector}",
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
        echo "Dynatrace event posted successfully."
        return response
    } catch (Exception e) {
        echo "Error while sending Dynatrace request: ${e.message}"
        return null
    }
}

return this







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


