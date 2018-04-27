# Habitat + Splunk

This repo demonstrates one way to forward Habitat health-check events to a Splunk HTTP Event Collector interface. It consists of four packages:

* **hello-node**, a simple JSON web service
* **hello-nginx**, a web server that sits in front of it,
* **hello-splunk**, a service designed to listen locally for JSON posts of health-check data and forward them to your instance of Splunk, and
* **http-health-check**, a binary package whose job is to call health-check endpoints and optionally forward their responses.

Here's how this works. The `hello-splunk` service is designed to be Splunk HEC-aware; it just accepts JSON payloads and forwards them to your configured instance of Splunk. The `http-health-check` package exposes a binary that accepts three arguments, all as JSON:

* the location of an HTTP health-check endpoint (e.g., `{ "port": 3000, "path": "/health" }`)
* the location of the HTTP destination (i.e., where you want to send the health-check endpoint's response), and
* an optional [`svc_member` object](https://www.habitat.sh/docs/reference/#svc_member) describing the service that was checked

If an HTTP service wants to support a health check, it can use `http-health-check` to call itself and send the results to any reachable HTTP destination. In this example, my `hello-node` and `hello-nginx` services both have `health_check` hooks that use `http-health-check` to forward their health to a locally running `hello-splunk` service, and `hello-splunk` sends both of their health data to Splunk.

![image](https://user-images.githubusercontent.com/274700/39382253-c2078482-4a19-11e8-8eb2-636dda70717a.png)

![image](https://user-images.githubusercontent.com/274700/39382502-8d613a60-4a1a-11e8-979c-69c5d366ff3f.png)

## Prerequisites

* A Splunk Cloud instance, Enterprise instance, or trial (I've just been using a Cloud trial)
* Splunk HTTP Event Collector (HEC) [enabled on your instance](http://dev.splunk.com/view/event-collector/SP-CAAAE7F), along with an HEC token

Once you have those, you should be good to go:

```
vagrant up
```

## Usage

With the VM provisioned, `ssh` in and apply your Splunk hostname, token and whatever other values need to be different [from the defaults](./packages/hello-splunk/habitat/default.toml). For convenience, there's a `user.toml` file at `/hab/user/hello-splunk/config/user.toml` that you can use to specify the configuration settings for your Splunk instance (minimally, you'll need to provide at least a `host` and `token`).

Once you've applied your Splunk settings done, just:

```
sudo hab sup run
```

... to run the Supervisor in the foreground, so you can keep an eye on what's happening easily. The packages referenced in this repo are all currently available on the public Habitat Depot, so you should be able to use them without having to build anything locally first.

I've also included a little hack to allow you to change the HTTP response of `hello-node`'s `/health` endpoint, just so you can see some variations in the Splunk data. To do that:

```
echo "status = 500
message = 'Internal Server Error, or Something
" | hab config apply hello-node.default $(date +%s)
```

If the services are all running and the logs look clean (i.e., no complaints about missing hosts or tokens), you should start seeing events spill into your Splunk search within a few seconds. By default, the `sourcetype` is set to `habitat-health-check`.
