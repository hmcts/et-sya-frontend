variable "product" {}

variable "component" {}

variable "location" {
  default = "UK South"
}

variable "env" {}

variable "common_tags" {
  type = map(string)
}
variable "family" {
  default     = "C"
  description = "The SKU family/pricing group to use. Valid values are `C` (for Basic/Standard SKU family) and `P` (for Premium). Use P for higher availability, but beware it costs a lot more."
}

variable "sku_name" {
  default     = "Basic"
  description = "The SKU of Redis to use. Possible values are `Basic`, `Standard` and `Premium`."
}

variable "capacity" {
  default     = "1"
  description = "The size of the Redis cache to deploy. Valid values are 1, 2, 3, 4, 5"
}

variable "rdb_backup_enabled" {
  type    = bool
  default = false
  description = "Enable Redis database backup. Default is false."
}

variable "rdb_backup_max_snapshot_count" {
  type        = string
  default     = "1"
  description = "The maximum number of snapshots to create as a backup. Only supported for Premium SKUs."
}

variable "redis_backup_frequency" {
  default     = "360"
  description = "The Backup Frequency in Minutes. Only supported on Premium SKUs. Possible values are: 15, 30, 60, 360, 720 and 1440"
}
