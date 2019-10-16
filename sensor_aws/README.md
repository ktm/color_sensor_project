# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

I finally just wrote a shell script: it.sh
Also need to create an IP alias:
sudo ifconfig lo0 alias 172.16.123.1
