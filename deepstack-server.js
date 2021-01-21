module.exports = function(RED) {
    function DeepstackServerNode(n) {
        RED.nodes.createNode(this,n);
        this.proto = n.proto;
        this.host = n.host;
        this.port = n.port;
        this.version = n.version;
        this.rejectUnauthorized = n.rejectUnauthorized;
    }
    RED.nodes.registerType("deepstack-server", DeepstackServerNode, {
        credentials: {
            apiKey: {type: "text"},
            adminKey: {type: "text"}
        }
    });
}