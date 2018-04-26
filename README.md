This repo demonstrates one way to forward Habitat health-check events to a Splunk HTTP Event Collector interface. It consists of three packages:

* **hello-node**, a simple JSON web service
* **hello-nginx**, a web server that sits in front of it, and
* **hello-splunk**, a service designed to listen locally for JSON posts of health-check data and forward them to your instance of Splunk.

The Nginx service doesn't do anything yet; as of now, all that's really happening here is that the Node app's `health_check` hook calls into its service's `/health` endpoint, captures its status as a JSON payload, and calls into the locally running `hello-splunk` service, which is configured to forward its messages to Splunk.

## Prerequisites

* A Splunk Cloud instance, Enterprise instance, or trial (I've just been using a Cloud trial)
* Splunk HTTP Event Collector (HEC) [enabled on your instance](http://dev.splunk.com/view/event-collector/SP-CAAAE7F), along with an HEC token

Once you have those, you should be good to go:

```
vagrant up
```

## Usage

With the VM provisioned, `ssh` in and apply your hostname, token and whatever other values need to be different [from the defaults](./packages/hello-splunk/habitat/default.toml). For convenience, there's a `user.toml` file at `/hab/user/hello-splunk/config/user.toml` that you can use to specify the configuration settings for your Splunk instance (minimally, you'll need to provide at least a `host` and `token`).

Once you've applied your Splunk settings done, just:

```
sudo hab sup run
```

... to run the Supervisor in the foreground, so you can keep an eye on what's happening easily.

I've also included a little hack to allow you to change the HTTP response of `hello-node`'s `/health` endpoint, just so you can see some variations in the Splunk data. To do that:

```
echo "status = 500
message = 'Internal Server Error, or Something
" | hab config apply hello-node.default $(date +%s)
```
