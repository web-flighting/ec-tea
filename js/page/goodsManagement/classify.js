$(function(){
    var arr = [
        {
            "id": 1,
            "name": "一级目录",
            "children": [
                {
                    "id": 11,
                    "name": "一级子节点",
                    "children": [
                        {
                            "id": 111,
                            "name": "一级子节点1"
                        },
                        {
                            "id": 112,
                            "name": "一级子节点2"
                        }
                    ]
                }
            ]
        }
    ];

    var tree = $.fn.zTree.init($("#tree"), {
        
    }, arr);
    tree.expandAll(true);

})