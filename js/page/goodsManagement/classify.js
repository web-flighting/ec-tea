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
    var treeNodes;
    //配置ztree显示添加、编辑、删除按钮
    function addDiyDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        var str = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' onfocus='this.blur();' title='新增'></span>";
        str += "<span class='button edit' id='editBtn_" + treeNode.tId
            + "' onfocus='this.blur();' title='编辑'></span>";
        str += "<span class='button remove' id='deleteBtn_" + treeNode.tId
        + "' onfocus='this.blur();' title='删除'></span>";
        sObj.after(str);
        var addBtn = $("#addBtn_"+treeNode.tId),
            editBtn = $("#editBtn_"+treeNode.tId),
            deleteBtn = $("#deleteBtn_"+treeNode.tId);
        if(addBtn){
            addBtn.on("click", function(){
                treeNodes = treeNode;
                $('#addEditModal').modal();
                $('#addEditModal .modal-title').text('新增');
                $('#relation').show();
                $('#confirm').attr('data-type', 'add');
            });
            editBtn.on("click", function(){
                treeNodes = treeNode;
                $('#addEditModal').modal();
                $('#addEditModal .modal-title').text('编辑');
                $('#relation').hide();
                $('#confirm').attr('data-type', 'edit');
            });
            deleteBtn.on("click", function(){
                parent.layer.confirm('确定要删除此分类吗？', {
                                
                }, function(){
                    var zTree = $.fn.zTree.getZTreeObj("tree");
                    zTree.removeNode(treeNode);
                    layer.closeAll();
                }, function(){
                    
                });
            });
        };
    };
    var setting = {
        'view': {
            'addDiyDom': addDiyDom,
            'selectedMulti': false
        }
    };
    var tree = $.fn.zTree.init($("#tree"), setting, arr);
    tree.expandAll(true);

    //确定按钮
    $('#confirm').on('click', function(){
        var _this = $(this),
            type = _this.attr('data-type');
        var obj = $('#form').serializeObject(); //表单中的数据
        if(!obj.name){
            $('#name').focus();
            return;
        };
        var zTree = $.fn.zTree.getZTreeObj("tree");
        if(type == 'add'){ //如果新增
            //同级
            if(obj.relation == 1){
                zTree.addNodes(treeNodes.getParentNode(), {"id": "2", "name": "同级"});
            }else{ //子级
                zTree.addNodes(treeNodes, {"id": "2", "name": "子级"});
            };
        }else{ //如果编辑
            treeNodes.name = '修改后的名字';
            zTree.updateNode(treeNodes);
        };
        $('#addEditModal').modal('hide');
    });

})