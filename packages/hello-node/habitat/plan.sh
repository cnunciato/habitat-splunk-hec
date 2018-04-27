pkg_name=hello-node
pkg_origin=cnunciato
pkg_version="0.1.0"
pkg_deps=(
  core/node
  core/curl
  cnunciato/http-health-check
)

pkg_exports=(
  [port]=port
)

pkg_binds_optional=(
  [splunk]="port"
)

do_build() {
  return 0
}

do_install() {
  cp index.js $pkg_prefix/
}
