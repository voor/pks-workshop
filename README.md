# PKS Workshop for Developers (1-2 days)

Purpose of this workshop is to guide developers (and curious operators) through **hands-on** exercises meant to reinforce verbal/whiteboard lessons.  Rather than repetitively write instructions on the whiteboard, I'm providing the various blurbs here with verbal cues to help people move along.

## Ops Manager

We'll leave this out of scope for most of this workshop, since it's more for Operators, but letting the developers get a feel for the fact there is an Ops Manager can reinforce the value line and what lives beneath the iceberg.

## PKS Tile

Again, not really big for developers, but briefly revisit the **Plans** and the concept of having a blueprint for clusters.

## Bosh

Viewing Kubernetes clusters through the Bosh Director to show the VMs in an IAAS agnostic fashion, also helps for troubleshooting in the life of an operator.

```
ssh ubuntu@<PIVOTAL-OPS-MANAGER-FQDN>
# Paste /api/v0/deployed/director/credentials/bosh_commandline_credentials
# alias bosh=""
bosh deployments
bosh -d service-instance_ vms
```

*(If people want to skip that, here's what it looks like)*
```
ubuntu@ip-10-0-0-195:~$ bosh deployments
Using environment '10.0.16.5' as client 'ops_manager'

Name                                                   Release(s)                          Stemcell(s)                                    Team(s)  
pivotal-container-service-e270cbb29aa9caf8fd27         backup-and-restore-sdk/1.8.0        bosh-aws-xen-hvm-ubuntu-xenial-go_agent/97.28  -  
                                                       bosh-dns/1.10.0                                                                      
                                                       bpm/0.6.0                                                                            
                                                       cf-mysql/36.14.0                                                                     
                                                       cfcr-etcd/1.4.1                                                                      
                                                       docker/32.0.3                                                                        
                                                       event-emitter/0.13.0                                                                 
                                                       kubo/0.21.1                                                                          
                                                       kubo-service-adapter/1.2.1-build.8                                                   
                                                       nsx-cf-cni/2.3.0.10066840                                                            
                                                       on-demand-service-broker/0.23.0                                                      
                                                       pks-api/1.2.1-build.8                                                                
                                                       pks-helpers/50.0.0                                                                   
                                                       pks-nsx-t/1.12.0                                                                     
                                                       pks-telemetry/0.9.2                                                                  
                                                       pks-vrli/0.6.0                                                                       
                                                       syslog-migration/11.1.1                                                              
                                                       uaa/60.8                                                                             
                                                       wavefront-proxy/0.9.0                                                                
service-instance_5b61a743-dc3c-4bfe-8662-f68aea7b9885  bosh-dns/1.10.0                     bosh-aws-xen-hvm-ubuntu-xenial-go_agent/97.28  pivotal-container-service-e270cbb29aa9caf8fd27  
                                                       bpm/0.6.0                                                                            
                                                       cfcr-etcd/1.4.1                                                                      
                                                       docker/32.0.3                                                                        
                                                       kubo/0.21.1                                                                          
                                                       nsx-cf-cni/2.3.0.10066840                                                            
                                                       pks-helpers/50.0.0                                                                   
                                                       pks-nsx-t/1.12.0                                                                     
                                                       pks-telemetry/0.9.2                                                                  
                                                       pks-vrli/0.6.0                                                                       
                                                       syslog-migration/11.1.1                                                              
                                                       wavefront-proxy/0.9.0                                                                

2 deployments

Succeeded
```

```
ubuntu@ip-10-0-0-195:~$ bosh -d service-instance_5b61a743-dc3c-4bfe-8662-f68aea7b9885 vms
Using environment '10.0.16.5' as client 'ops_manager'

Task 147. Done

Deployment 'service-instance_5b61a743-dc3c-4bfe-8662-f68aea7b9885'

Instance                                     Process State  AZ          IPs       VM CID               VM Type    Active  
master/09fd8659-9f94-48d5-a314-39bf4504bd22  running        us-east-1a  10.0.8.5  i-01c3f3427d92224c6  m4.large   true  
worker/bfbe738d-a56e-4272-86f1-e29310511625  running        us-east-1c  10.0.9.5  i-0bf906ca80071d68e  t2.medium  true  
worker/c2ffc831-1bfd-4085-9cbd-d5120c4deb63  running        us-east-1a  10.0.8.7  i-07c65c697070d37d2  t2.medium  true  
worker/c5cf31ab-97bd-4b55-8504-2109dfe39358  running        us-east-1a  10.0.8.6  i-074fe8d9d84cdc374  t2.medium  true  

4 vms

Succeeded
```

I know, that was magical.

## PKS CLI

[Pivotal Networks](https://network.pivotal.io/products/pivotal-container-service) -- download CLI tool here.
[PKS Documentation](https://docs.pivotal.io/runtimes/pks/)

```
$ pks

The Pivotal Container Service (PKS) CLI is used to create, manage, and delete Kubernetes clusters. To deploy workloads to a Kubernetes cluster created using the PKS CLI, use the Kubernetes CLI, kubectl.

Version: 1.2.1-build.8

Usage:
  pks [command]

Available Commands:
  cluster                View the details of the cluster
  clusters               Show all clusters created with PKS
  create-cluster         Creates a kubernetes cluster, requires cluster name, an external host name, and plan
  create-network-profile Create a network profile
  delete-cluster         Deletes a kubernetes cluster, requires cluster name
  delete-network-profile Delete a network profile
  get-credentials        Allows you to connect to a cluster and use kubectl
  help                   Help about any command
  login                  Log in to PKS
  logout                 Log out of PKS
  network-profiles       Show all network profiles created with PKS
  plans                  View the preconfigured plans available
  resize                 Increases the number of worker nodes for a cluster

Flags:
  -h, --help      help for pks
      --version   version for pks

Use "pks [command] --help" for more information about a command.

```

```
$ pks login -a ${PKS_ENDPOINT} -u ${PKS_USER} -p ${PKS_PASSWORD} -k

API Endpoint: api.pks.dev.pivdevops.com
User: admin
```

```
$ pks clusters

Name  Plan Name  UUID                                  Status     Action
a     medium     5b61a743-dc3c-4bfe-8662-f68aea7b9885  succeeded  CREATE
```

```
$ pks cluster a

Name:                     a
Plan Name:                medium
UUID:                     5b61a743-dc3c-4bfe-8662-f68aea7b9885
Last Action:              CREATE
Last Action State:        succeeded
Last Action Description:  Instance provisioning completed
Kubernetes Master Host:   a.dev.pivdevops.com
Kubernetes Master Port:   8443
Worker Nodes:             3
Kubernetes Master IP(s):  10.0.8.5

```

```
$ pks get-credentials a

Fetching credentials for cluster a.
Context set for cluster a.

You can now switch between clusters by using:
$kubectl config use-context <cluster-name>
```

This segues into `kubectl` nicely...

## kubectl CLI

* Installation
```
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```
* Authentication, explain `~/.kube/config` 
* Extremely brief here, because they don't know what to do with `kubectl` since they haven't really be introduced to Kubernetes yet.

## Containers 101

If people have docker on their machines, great, if they don't, even better:

```
kubectl -n MYNAMESPACE run -i --tty node --image=node --restart=Never -- /bin/bash -il
```

This is more effective if they have `node` installed on their machines, since it's most likely not going to be version 11 (which is what `latest` is right now)

In another terminal:

```
kubectl -n MYNAMESPACE get po
```

## Kubernetes 101

```
kubectl describe po node
```

* Declarative, etc.
* "Essentially an infinite loop"
* `kubectl proxy` and [Dashboard](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/overview?namespace=default)

## Kubernetes Kinds

Touch on the major ones.

## Complex Application Deployments

### Simple POD App

This is bad practice, but it's a building block to better understand how kubernetes works.

```
kubectl create ns MYNAMESPACE 
kubectl -n MYNAMESPACE create -f ui-pod.yml
kubectl -n MYNAMESPACE describe po ui
kubectl -n MYNAMESPACE logs ui-pod # ERROR!
kubectl -n MYNAMESPACE logs ui-pod ui
kubectl -n MYNAMESPACE logs ui-pod backend
kubectl -n MYNAMESPACE exec -it ui-pod -- /bin/bash
```

### Deployment + Service + Ingress 

```
kubectl -n MYNAMESPACE create -f ui-deploy.yml
# Change the hostname so you don't stomp on each other!
kubectl -n MYNAMESPACE create -f ui-ingress.yml
```

* (optional segue into Istio to talk about alternatives to Ingress and straight Load Balancers)

## Events, Logging

Look at events associated, logging

## Persistent Volumes and Persistent Volume Claims

```
kubectl create -f persistent-volumes/aws-ebs-storageclass.yaml
kubectl create ns redis
kubectl create -n redis -f persistent-volumes/aws-ebs-pvc.yaml
helm install --set persistence.existingClaim=redis-data --name redis --namespace redis stable/redis-ha 
```

Some errors to discuss:

```
Name:               punk-boxer-redis-ha-server
Namespace:          default
CreationTimestamp:  Tue, 27 Nov 2018 10:00:11 -0500
Selector:           app=redis-ha,release=punk-boxer
Labels:             app=redis-ha
                    chart=redis-ha-3.0.1
                    heritage=Tiller
                    release=punk-boxer
Annotations:        <none>
Replicas:           3 desired | 1 total
Update Strategy:    RollingUpdate
Pods Status:        0 Running / 1 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=redis-ha
                release=punk-boxer
  Annotations:  checksum/config=62c3ca5674b4a0a778bc343cf8080a0739d8092d8ca7e06816b885dba69dc53f
  Init Containers:
   config-init:
    Image:      redis:4.0.11-alpine
    Port:       <none>
    Host Port:  <none>
    Command:
      sh
    Args:
      /readonly-config/init.sh
    Environment:
      POD_IP:   (v1:status.podIP)
    Mounts:
      /data from data (rw)
      /readonly-config from config (ro)
  Containers:
   redis:
    Image:      redis:4.0.11-alpine
    Port:       6379/TCP
    Host Port:  0/TCP
    Command:
      redis-server
    Args:
      /data/conf/redis.conf
    Liveness:     exec [redis-cli ping] delay=15s timeout=1s period=5s #success=1 #failure=3
    Readiness:    exec [redis-cli ping] delay=15s timeout=1s period=5s #success=1 #failure=3
    Environment:  <none>
    Mounts:
      /data from data (rw)
   sentinel:
    Image:      redis:4.0.11-alpine
    Port:       26379/TCP
    Host Port:  0/TCP
    Command:
      redis-sentinel
    Args:
      /data/conf/sentinel.conf
    Liveness:     exec [redis-cli -p 26379 ping] delay=15s timeout=1s period=5s #success=1 #failure=3
    Readiness:    exec [redis-cli -p 26379 ping] delay=15s timeout=1s period=5s #success=1 #failure=3
    Environment:  <none>
    Mounts:
      /data from data (rw)
  Volumes:
   config:
    Type:      ConfigMap (a volume populated by a ConfigMap)
    Name:      punk-boxer-redis-ha-configmap
    Optional:  false
Volume Claims:
  Name:          data
  StorageClass:  
  Labels:        <none>
  Annotations:   <none>
  Capacity:      10Gi
  Access Modes:  [ReadWriteOnce]
Events:
  Type    Reason            Age   From                    Message
  ----    ------            ----  ----                    -------
  Normal  SuccessfulCreate  6m    statefulset-controller  create Claim data-punk-boxer-redis-ha-server-0 Pod punk-boxer-redis-ha-server-0 in StatefulSet punk-boxer-redis-ha-server success
  Normal  SuccessfulCreate  6m    statefulset-controller  create Pod punk-boxer-redis-ha-server-0 in StatefulSet punk-boxer-redis-ha-server successful

```

```
Name:          data-punk-boxer-redis-ha-server-0
Namespace:     default
StorageClass:  
Status:        Pending
Volume:        
Labels:        app=redis-ha
               release=punk-boxer
Annotations:   <none>
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      
Access Modes:  
Events:
  Type    Reason         Age               From                         Message
  ----    ------         ----              ----                         -------
  Normal  FailedBinding  1m (x26 over 7m)  persistentvolume-controller  no persistent volumes available for this claim and no storage class is set
```

## Stateful Sets

Move data layer into a stateful set (redis for example)

```
kubectl exec -it redis-redis-ha-server-0 sh -n redis
```

```
/data $ df -h | grep data
/dev/xvdbe                9.7G     22.5M      9.7G   0% /data
```

```
/data $ redis-cli -h redis-redis-ha.redis.svc.cluster.local
redis-redis-ha.redis.svc.cluster.local:6379> incr mycounter
(error) READONLY You can't write against a read only slave.
```

```
/data $ redis-cli -h redis-redis-ha-server-0.redis-redis-ha.redis.svc.cluster.local
redis-redis-ha-server-0.redis-redis-ha.redis.svc.cluster.local:6379> incr mycounter
(integer) 1
```

## Batch Jobs

Load data into redis through a batch job

```
kubectl create configmap data-config -n redis --from-file=data.txt=data.txt
kubectl describe configmap data-config -n redis
```

```
kubectl create -n redis -f redis-job.yml
```

Little trick you learn over the years:

```
kubectl create configmap data-config -n redis --from-file=data.txt=data.txt -o yaml --dry-run | kubectl replace -f -
```

## Overflow: Metrics / Prometheus / Grafana

If still time left, or at least discuss observability and scraping.

## Advanced Topics: Helm / Istio / Knative (Riff, PFS)

Did you now we did stuff to this cluster before the workshop?

 * Added a Helm Tiller (since Ingress and Redis was installed as charts)
 ```
kubectl -n kube-system create serviceaccount tiller
kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
mkdir -p ~/bin && pushd ~/bin && curl -LsS https://storage.googleapis.com/kubernetes-helm/helm-v2.11.0-linux-amd64.tar.gz | tar xz linux-amd64/helm --strip-components 1 && chmod +x helm && popd
~/bin/helm init --service-account=tiller
```
 * Added an Ingress Controller and provided a default SSL Cert
 ```
# Make sure to modify the ACM cert first!
helm install stable/nginx-ingress --name nginx-ingress --namespace ingress --values ingress/ingress-values.yml
```