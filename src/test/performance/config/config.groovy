return [

//Static vars
dynatraceApiHost = "https://yrk32651.live.dynatrace.com/api/"
dynatraceEventIngestEndpoint = "/v2/events/ingest"

//Vars for eventIngest
def serviceType = "type(service)"
def kubernetesNamespaceTag = "[Kubernetes]namespace:et"
def environmentTag = "Environment:PERF"
def entityId = "SERVICE-894163B308FBDD78"

def entitySelector = "${serviceType},tag(\"${kubernetesNamespaceTag}\"),tag(\"${environmentTag}\"),entityId(\"${entityId}\")"

//Object Maps
// commonHeaders: [
    // 'Content-Type': 'application/json'
// ],

eventIngestDetails: [
    eventType: "CUSTOM_INFO",
    timeout: 1,
    title: "ET-SYA-Frontend Performance Event",
    entitySelector: "${entitySelector}"
]


 // Print the loaded config
 echo "INSIDE CONFIG: Dynatrace API URL: ${env.dynatraceApiHost}"
 //echo "Dynatrace Endpoint: ${config.dynatraceEventIngestEndpoint}"
 //echo "Entity Selector: ${config.eventIngestDetails.entitySelector}"
 //Load Config
 //def config = load '.\src\test\performance\config\config.groovy'
 // Accessing the entitySelector from the config map
 echo "INSIDE CONFIG: Entity Selector: ${env.eventIngestDetails.entitySelector}"


]