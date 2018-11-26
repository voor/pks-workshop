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
* Authentication, explain `~/.kube/config` 
* Extremely brief here, because they don't know what to do with `kubectl` since they haven't really be introduced to Kubernetes yet.

## Containers 101

If people have docker on their machines, great, if they don't, even better:

```
kubectl run -i --tty node --image=node --restart=Never -- /bin/bash -il
```

This is more effective if they have `node` installed on their machines, since it's most likely not going to be version 11 (which is what `latest` is right now)

In another terminal:

```
kubectl get po
```

## Kubernetes 101

```
kubectl describe po node
```

* Declarative, etc.
* "Essentially an infinite loop"

## Kubernetes Kinds

Touch on the major ones.

## Complex Application Deployments

Deployment + Service + Ingress 

* (optional segue into Istio to talk about alternatives to Ingress and straight Load Balancers)

## Events, Logging

Look at events associated, logging

## Persistent Volumes and Persistent Volume Claims


## Stateful Sets

Move data layer into a stateful set (redis for example)

## Batch Jobs

Load data into redis through a batch job

## Overflow: Metrics / Prometheus / Grafana

If still time left, or at least discuss observability and scraping.