//Static vars
def dynatraceApiHost: "https://yrk32651.live.dynatrace.com/api/"
def dynatraceEventIngestEndpoint: "/v2/events/ingest"

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