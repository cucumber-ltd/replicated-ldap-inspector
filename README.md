## Build

    export version=10
    docker build -t registry.replicated.com/cucumberpro/replicated-ldap-inspector:${version} .

## Publish to replicated

    docker push registry.replicated.com/cucumberpro/replicated-ldap-inspector:${version}

## Debugging the Identity API

It can be accessed with cURL on the host:

    curl -k -v -X POST -H "Content-Type: application/json" -d "{"username":"value1", "password":"value2"}" https://138.68.181.33:9880/identity/v1/login