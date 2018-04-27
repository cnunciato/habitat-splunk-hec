pkg_name=http-health-check
pkg_origin=cnunciato
pkg_version="0.1.0"
pkg_deps=(core/coreutils core/node)
pkg_bin_dirs=(bin)

do_build() {
  return 0
}

do_install() {
  mkdir -p $pkg_prefix/bin
  binfile=$pkg_prefix/bin/$pkg_name
  cp bin/$pkg_name $binfile
  chmod +x $binfile
  fix_interpreter "$(readlink -f -n "$binfile")" core/coreutils bin/env
}
