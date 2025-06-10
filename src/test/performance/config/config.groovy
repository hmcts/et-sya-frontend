// ====== Set up default values ======
this.dynatraceApiHost = "https://yrk32651.live.dynatrace.com/"
this.dynatraceEventIngestEndpoint = "api/v2/events/ingest"
this.dynatraceMetricIngestEndpoint = "api/v2/metrics/ingest"
this.dynatraceTriggerSyntheticEndpoint = "api/v2/synthetic/executions/batch"
this.dynatraceUpdateSyntheticEndpoint = "api/v1/synthetic/monitors/"
this.dynatraceMetricType = 'nodejs'
this.dynatraceMetricTag = 'namespace:et'

// ====== Define the config-setting method as a closure ======
def setEnvironmentConfigClosure = { String envName ->
    if (envName == "preview") {
        this.dynatraceSyntheticPerfTest = "SYNTHETIC_TEST-008CAF328F244320"
        this.dynatraceDashboardId = "a4576442-06a9-4a76-baa5-5342a525679f"
    } else if (envName == "aat") {
        this.dynatraceSyntheticPerfTest = "SYNTHETIC_TEST-5EEFBE93947768B3"
        this.dynatraceDashboardId = "aat-dashboard-id-4567"
    } else if (envName == "perftest") {
        this.dynatraceSyntheticPerfTest = "SYNTHETIC_TEST-008CAF328F244320"
        this.dynatraceDashboardId = "a4576442-06a9-4a76-baa5-5342a525679f"
        this.dynatraceDashboardURL = "https://yrk32651.live.dynatrace.com/#dashboard;id=a4576442-06a9-4a76-baa5-5342a525679f;applyDashboardDefaults=true"
        this.dynatraceEntitySelector = 'type(service),tag(\\"[Kubernetes]namespace:et\\"),tag(\\"Environment:PERF\\"),entityId(\\"SERVICE-894163B308FBDD78\\")'
    } else {
        error("Unknown environment: ${envName}")
    }
}

// ====== Assign the closure to `this` ======
this.setEnvironmentConfig = setEnvironmentConfigClosure

// ====== Return `this` so the caller can access it ======
return this
