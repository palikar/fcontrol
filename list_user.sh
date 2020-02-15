#!/usr/bin/env sh

dir=$(grep "logging_dir" lib/config.json | sed -e 's/ *"logging_dir" : "\(.*\)"/\1/g')
eval "dir=$dir"
grep -P ";[\s\w]*${1}[\s\w]*;" "$dir/msgs.log"




