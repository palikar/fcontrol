#!/usr/bin/env sh

dir=$(grep "logging_dir" lib/config.json | sed -e 's/ *"logging_dir" : "\(.*\)"/\1/g')
eval "dir=$dir"
threadID=$(grep -P ";[\s\w]*$1[\s\w]*;" ~/core.d/fcontrol/logging.d/msgs.log| head -n1 | grep -P "(?<=\d{4}-\d{2}-\d{2}.\d{2}:\d{2}:\d{2}\.\d{3}.:)\d*" -o)
( grep -P ";[\s\w]*$1[\s\w]*;" ~/core.d/fcontrol/logging.d/msgs.log && cat ~/core.d/fcontrol/logging.d/personal.log ) | sort -t ";" -k 1 | grep $threadID




