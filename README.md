## Build

    export version=15
    docker build -t registry.replicated.com/ldapinspector/replicated-ldap-inspector:${version} .

## Publish to replicated

    docker push registry.replicated.com/ldapinspector/replicated-ldap-inspector:${version}

## Access the hosted version

    http://138.68.181.33:18080/

## Debugging the Identity API

It can be accessed with cURL on the host:

    curl --insecure --verbose -X POST -H "Content-Type: application/json" -d "{"username":"value1", "password":"value2"}" https://138.68.181.33:9880/identity/v1/login