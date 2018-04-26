pkg_name=hello-splunk
pkg_origin=cnunciato
pkg_version="0.1.0"
pkg_deps=(core/node)

pkg_exports=(
  [port]=port
)

do_build() {
  return 0
}

do_install() {
  cp index.js $pkg_prefix/
}
