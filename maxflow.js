// https://gist.github.com/methodin/1561824
// Represents an edge from source to sink with capacity
(function(){
var Edge = function(source, sink, capacity) {
    this.source = source;
    this.sink = sink;
    this.capacity = capacity;
    this.reverseEdge = null;
    this.flow = 0;
};
 
// Main class to manage the network
window.FlowNetwork = function() {
    this.edges = {};
 
    // Is this edge/residual capacity combination in the path already?
    this.findEdgeInPath = function(path, edge, residual) {
        for(var p=0;p<path.length;p++) 
            if(path[p][0] == edge && path[p][1] == residual) 
                return true;
        return false;
    };
    
    this.addEdge = function(source, sink, capacity) {
        if(source == sink) return;
        
        // Create the two edges = one being the reverse of the other    
        var edge = new Edge(source, sink, capacity);
        var reverseEdge = new Edge(sink, source, 0);
        
        // Make sure we setup the pointer to the reverse edge
        edge.reverseEdge= reverseEdge;
        reverseEdge.reverseEdge = edge;
        
        if(this.edges[source] === undefined) this.edges[source] = [];
        if(this.edges[sink] === undefined) this.edges[sink] = [];   
        
        this.edges[source].push(edge);
        this.edges[sink].push(reverseEdge);
    };
    
    // Finds a path from source to sink
    this.findPath = function(source, sink, path) {
        if(source == sink) return path;
        
        for(var i=0;i<this.edges[source].length;i++) {
            var edge = this.edges[source][i];
            var residual = edge.capacity - edge.flow;
            
            // If we have capacity and we haven't already visited this edge, visit it
            if(residual > 0 && !this.findEdgeInPath(path, edge, residual)) {
                var tpath = path.slice(0);
                tpath.push([edge, residual]);
                var result = this.findPath(edge.sink, sink, tpath);
                if(result != null) return result;
            } 
        }
        return null;
    };
    
    // Find the max flow in this network
    this.maxFlow = function(source, sink) {
        var path = this.findPath(source, sink, []);
        while(path != null) {
            var flow = 999999;
            // Find the minimum flow
            for(var i=0;i<path.length;i++)
                if(path[i][1] < flow) flow = path[i][1];
            // Apply the flow to the edge and the reverse edge
            for(var i=0;i<path.length;i++) {
                path[i][0].flow += flow;
                path[i][0].reverseEdge.flow -= flow;
            } 
            path = this.findPath(source, sink, []);
        }
        var sum = 0;
        for(var i=0;i<this.edges[source].length;i++)
            sum += this.edges[source][i].flow;
        return sum;
    };
};
})();