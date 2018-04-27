pkg_name=hello-nginx
pkg_origin=cnunciato
pkg_version="0.1.0"
pkg_svc_user="root"

pkg_deps=(
  core/nginx
  cnunciato/http-health-check
)

pkg_binds=(
  [app]="port"
)

pkg_binds_optional=(
  [splunk]="port"
)

do_build() {
  return 0
}

do_install() {
  return 0
}
