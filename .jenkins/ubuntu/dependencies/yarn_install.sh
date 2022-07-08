yarn_install() {
  echo "yarn install"
  tmp/tools/ubuntu/run.sh "yarn install --network-timeout 1000000"
}

# Allow for multiple attempts to install dependencies
for i in $(seq 5); do
  yarn_install && break
  if [ $i == 5 ]; then
    exit 1
  else
    sleep 5
  fi
done
