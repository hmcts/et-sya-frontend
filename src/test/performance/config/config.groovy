// ====== Set up default values ======
this.dynatraceApiHost = "https://yrk32651.live.dynatrace.com/"
this.dynatraceEventIngestEndpoint = "api/v2/events/ingest"
this.dynatraceMetricIngestEndpoint = "api/v2/metrics/ingest"
this.dynatraceTriggerSyntheticEndpoint = "api/v2/synthetic/executions/batch"
this.dynatraceUpdateSyntheticEndpoint = "api/v1/synthetic/monitors/"
this.dynatraceMetricType = 'nodejs'
this.dynatraceMetricTag = 'namespace:et'
this.dynatraceSyntheticTest = ""
this.dynatraceDashboardId = ""
this.dynatraceDashboardURL = ""
this.dynatraceEntitySelector = ""
//Preview Config
this.dynatraceSyntheticTestPreview = "SYNTHETIC_TEST-008CAF328F244320"
this.dynatraceDashboardIdPreview = "a4576442-06a9-4a76-baa5-5342a525679f"
this.dynatraceDashboardURLPreview = "https://yrk32651.live.dynatrace.com/#dashboard;id=a4576442-06a9-4a76-baa5-5342a525679f;applyDashboardDefaults=true"
this.dynatraceEntitySelectorPreview = 'type(service),tag(\\"[Kubernetes]namespace:et\\"),tag(\\"Environment:PERF\\"),entityId(\\"SERVICE-894163B308FBDD78\\")'
//AAT Config
this.dynatraceSyntheticTestAAT = "SYNTHETIC_TEST-5EEFBE93947768B3"
this.dynatraceDashboardIdAAT = "a529a685-8c36-4e8c-8137-67de8bfcf104"
this.dynatraceDashboardURLAAT = "https://yrk32651.live.dynatrace.com/#dashboard;gtf=-2h;gf=all;id=a529a685-8c36-4e8c-8137-67de8bfcf104"
this.dynatraceEntitySelectorAAT = 'type(service),tag(\\"[Kubernetes]namespace:et\\"),tag(\\"Environment:AAT\\"),entityId(\\"SERVICE-A4FABE4A326198FC\\")'
//Perftest Config
this.dynatraceSyntheticTest = "SYNTHETIC_TEST-008CAF328F244320"
this.dynatraceDashboardIdPerfTest = "a4576442-06a9-4a76-baa5-5342a525679f"
this.dynatraceDashboardURLPerfTest = "https://yrk32651.live.dynatrace.com/#dashboard;id=a4576442-06a9-4a76-baa5-5342a525679f;applyDashboardDefaults=true"
this.dynatraceEntitySelectorPerfTest = 'type(service),tag(\\"[Kubernetes]namespace:et\\"),tag(\\"Environment:PERF\\"),entityId(\\"SERVICE-894163B308FBDD78\\")'

this.Test = "CheckingConfigFile"

echo "Completed Config Load..."
// ====== Return `this` so the caller can access it ======
return this
