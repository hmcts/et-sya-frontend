// Performance in pipelines 

def sayHello(name) {
    echo "Hello, ${name}!"
}

def dynatraceApiHost
def dynatraceEventIngestEndpoint
def dynatraceMetricIngestEndpoint
def dynatraceTriggerSyntheticEndpoint
def dynatraceSyntheticPerfTest
def dynatraceDashboardId
def dynatraceEntitySelector

this.Test = "dev"

//Perf Vars (*Need to add to config file)
this.dynatraceApiHost = "https://yrk32651.live.dynatrace.com/"
this.dynatraceEventIngestEndpoint = "api/v2/events/ingest"
this.dynatraceMetricIngestEndpoint = "api/v2/metrics/ingest"
this.dynatraceTriggerSyntheticEndpoint = "api/v2/synthetic/executions/batch"
this.dynatraceSyntheticPerfTest = "SYNTHETIC_TEST-008CAF328F244320"
this.dynatraceDashboardId = "a4576442-06a9-4a76-baa5-5342a525679f"
this.dynatraceEntitySelector = 'type(service),tag(\\"[Kubernetes]namespace:et\\"),tag(\\"Environment:PERF\\"),entityId(\\"SERVICE-894163B308FBDD78\\")'
this.dynatraceMetricType = 'nodejs'
this.dynatraceMetricTag = 'namespace:et'

//type(service),tag(\\"[Kubernetes]namespace:et\\"),tag(\\"Environment:PERF\\"),entityId(\\"SERVICE-894163B308FBDD78\\")
echo "Inside the config file: ${dynatraceTriggerSyntheticEndpoint}"

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


