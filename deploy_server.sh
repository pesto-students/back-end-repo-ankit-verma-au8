#aws configuration
AWS_REGION='us-east-1'
AWS_LOGS_GROUP='TRACKPE_PROD'
AWS_LOGS_STREAM='core_out_logs'
AWS_SECRET_ID="prod/trackpe"
ECR_REGISTRY_URI="381491827390.dkr.ecr.ap-south-1.amazonaws.com/trackpe"


# docker configuration
SERVER_CONATINER_NAME='trackpe-server'
SERVER_IMAGE_NAME=$ECR_REGISTRY_URI:latest
HOST_PORT=4000

# create secret file -> env.txt
echo "create new secret file"
aws secretsmanager get-secret-value --secret-id $AWS_SECRET_ID --query SecretString --output text > ~/env.txt

# removing old backend container if exist
docker ps -a | grep "$SERVER_CONATINER_NAME" > /dev/null && (echo "removing old backend container" && docker container stop $SERVER_CONATINER_NAME && docker container rm $SERVER_CONATINER_NAME)

# pulling be container
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY_URI
docker pull $SERVER_IMAGE_NAME

# starting backend container
echo "starting backend container"
docker run -d --restart unless-stopped \
--env-file ~/env.txt \
-p 4000:$HOST_PORT \
--log-driver="awslogs" \
--log-opt awslogs-region=$AWS_REGION \
--log-opt awslogs-group=$AWS_LOGS_GROUP \
--log-opt awslogs-stream=$AWS_LOGS_STREAM \
--name $SERVER_CONATINER_NAME \
$SERVER_IMAGE_NAME \
bash -c "npm run db:migrate && npm run start"
echo "Prune unwanted images"
docker image prune -a -f