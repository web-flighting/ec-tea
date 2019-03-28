$(function(){
    var treeNodes;
    //配置ztree显示添加、编辑、删除按钮
    function addDiyDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span"),
            str = '';
        //限制最多3级分类
        if(treeNode.level < 2){
            str += "<span class='button add' id='addBtn_" + treeNode.tId
            + "' onfocus='this.blur();' title='新增'></span>";
        };
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
                $('#name').val('');
                $('#addEditModal').modal();
                $('#addEditModal .modal-title').text('新增');
                $('#relation').show();
                $('#confirm').attr('data-type', 'add');
            });
            editBtn.on("click", function(){
                treeNodes = treeNode;
                $('#name').val(treeNode.categoryName);
                $('#addEditModal').modal();
                $('#addEditModal .modal-title').text('编辑');
                $('#relation').hide();
                $('#confirm').attr('data-type', 'edit');
            });
            deleteBtn.on("click", function(){
                parent.layer.confirm('确定要删除此分类吗？', {
                                
                }, function(){
                    method.ajax({
                        'url': 'data/goodsManagement/deleteCategory.json',
                        'type': 'get',
                        'data': {"categoryId": treeNode.id},
                        'success': function(res){
                            var zTree = $.fn.zTree.getZTreeObj("tree");
                            zTree.removeNode(treeNode);
                            layer.closeAll();
                        } 
                    });
                }, function(){
                    
                });
            });
        };
    };
    //获取商品分类树形结构列表
    var data = {},
        userParams = wsCache.get('userParams');
        data.roleId = userParams.roleId;
        data.menuId = userParams.menuId;
    method.ajax({
        'url': 'data/goodsManagement/queryCategoryTree.json',
        'type': 'get',
        'data': data,
        'success': function(res){
            var setting = {
                'view': {
                    'addDiyDom': addDiyDom,
                    'selectedMulti': false
                },
                'data': {
                    'key': {
                        'name': 'categoryName',
                        'children': 'teaCategoryTreeChildren'
                    }
                }
            };
            var tree = $.fn.zTree.init($("#tree"), setting, res.body.teaCategoryTrees);
            tree.expandAll(true);
        } 
    });

    //获取分类关系
    method.ajax({
        'url': 'data/goodsManagement/initCategoryAddPage.json',
        'type': 'get',
        'success': function(res){
            var data = res.body.categoryRelationSelect.selectOptionItems,
                html = template('optionTpl',{data: data});
            $('#relationSelect').html(html);
        } 
    });

    //确定按钮
    $('#confirm').on('click', function(){
        var _this = $(this),
            type = _this.attr('data-type');
        var obj = $('#form').serializeObject(); //表单中的数据
        if(!obj.categoryName){
            $('#name').focus();
            return;
        };
        var zTree = $.fn.zTree.getZTreeObj("tree");
        if(type == 'add'){ //如果新增
            method.ajax({
                'url': 'data/goodsManagement/doAddCategory.json',
                'type': 'get',
                'data': obj,
                'success': function(res){
                    location.reload();
                    //同级
                    // if(obj.categoryRelation == 0){
                    //     zTree.addNodes(treeNodes.getParentNode(), {"id": res.body.id, "categoryName": res.body.categoryName});
                    // }else{ //子级
                    //     zTree.addNodes(treeNodes, {"id": res.body.id, "categoryName": res.body.categoryName});
                    // };
                    // $('#addEditModal').modal('hide');
                } 
            });
        }else{ //如果编辑
            var data = {
                "categoryId": treeNodes.id,
                "categoryName": obj.categoryName
            };
            method.ajax({
                'url': 'data/goodsManagement/doEditCategory.json',
                'type': 'get',
                'data': data,
                'success': function(res){
                    treeNodes.categoryName = data.categoryName;
                    zTree.updateNode(treeNodes);
                    $('#addEditModal').modal('hide');
                } 
            });
        };
    });

})