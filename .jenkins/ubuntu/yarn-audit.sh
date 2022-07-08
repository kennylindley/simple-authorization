#!/bin/bash
#
# Yarn audit exits with a non-0 exit code if there are issues of any severity found.
# It generates an exit code based on adding the following together:
# see: https://yarnpkg.com/lang/en/docs/cli/audit/
#
# * 1 for INFO
# * 2 for LOW
# * 4 for MODERATE
# * 8 for HIGH
# * 16 for CRITICAL
#
# This script will exit with a non-0 exit code only if critical issues are found.

tmp/tools/ubuntu/run.sh "yarn audit --level critical; [[ $? -ge 16 ]] && exit 1 || exit 0"
