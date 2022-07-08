npm_config() {
  echo "NPM Config"

  command="echo '//npm.pkg.github.com/:_authToken=$GITHUB_MACHINE_PSW' > .npmrc"
  command+=" && echo '@simplymadeapps:registry=https://npm.pkg.github.com' >> .npmrc"

  tmp/tools/ubuntu/run.sh "$command"
}

main() {
  npm_config && \
  sh .jenkins/ubuntu/dependencies/yarn_install.sh
}

main
