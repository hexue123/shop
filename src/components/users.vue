<template>
  <el-card class="box-card card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框组件+添加用户按钮 -->
    <!-- 使用行列布局 -->
    <el-row>
      <el-col>
        <!--clearable 表示这是一个可清空的输入框  
            点击X清空后，还会触发一个clear事件，然后触发一个获取所有用户的方法 
        -->
        <el-input
          clearable
          @clear="getAllUsers()"
          placeholder="请输入用户名"
          v-model="query"
          class="input-with-select"
        >
          <!-- 点击确认按钮后，也会获取用户方法 -->
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>

        <el-button type="primary" @click="showDiaAdd()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <!-- 
         data是表格的数据源
         el-table-column 列 (每列行数是data绑定数据的长度)
         label=""  是每列表头的文本
         width=""  是每列的宽度
         prop=""   每一列每一个单元格的数据 来源于tableData中每个对象的key名  

         根据请求获取的表格数据的每列单元格数据所对应的的字段名
         实际获取的表格数据字段
         create_time
         email
         id
         mg_state
         mobile
         role_name
        username
    -->
    <el-table :data="tableData" style="width: 80%" height="300px">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>

      <el-table-column label="创建日期" width="180">
        <!-- 注意:
               如果单元格的数据不再是prop的值key所对应的值了
               此时，需要给显示的内容外包一层容器template
        -->
        <template slot-scope="data">
          <!--但是此时由于被template包裹了，所以数据需要借助solt-scope把外界数据传进来
                   "data"会自动获取上层数据:data="tableData"的值
                   再通过.row的方式获取对应数据(数组)里的每一个元素(对象)
                   这样事件数据就被获取到了，别过滤器准确处理了
          -->
          {{data.row.create_time|fmData}}
        </template>
      </el-table-column>

      <el-table-column label="用户状态" width="140">
        <!--使用slot-scope 把外部数据传进来  -->
        <template slot-scope="data">
          <!-- 里层就可以通过data.row获取数据，其实就是bool类型的值
                 然后通过bool类型值来控制开关状态的
          -->
          <el-switch
            v-model="data.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(data.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <!-- 单元格数据也不是来自prop的值所对应的key值，所以包裹一下 -->
        <template slot-scope="data">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            :plain="true"
            @click="showDiaEdit(data.row)"
          ></el-button>

          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            :plain="true"
            @click="showDeleConfig(data.row)"
          ></el-button>

          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            :plain="true"
            @click="showRoleDia(data.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件
         分页组件参数介绍
         @size-change  每页数据条数发生改变时触发
         @current-change  当前页码发生改变时触发
         current-page   当前页码
         page-size    当前页显示数据条数
         total    数据总条数
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">
           {{currUsername}}
        </el-form-item>

        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currRoleId">
            <!-- 
                下拉列表值的分析
                1.请选择
                2.根据网络请求获取所有角色的名称
                
                注意: v-model与select关系分析
                如果v-model绑定数据的值与option中value值一致时，默认显示对应option中的label值
                如果选中了某个option，那么对应option的value值就与v-model的值一致
             -->
            <el-option label="请选择" disabled :value="-1"></el-option>
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      //控制添加对话框显示与隐藏的数据，默认隐藏
      dialogFormVisibleAdd: false,
      //确认对话框里的数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //统一设置每个输入框宽度
      formLabelWidth: "100px",
      //编辑用户的数据
      // 默认为false，不展示
      dialogFormVisibleEdit: false,
      //分配角色的对话框数据
      // 默认不显示
      dialogFormVisibleRole:false,
      //select 所绑定的数据
      currRoleId:-1,
      // 角色信息数组
      roles:[],
      // 当前用户姓名
      currUsername:"",
      //自己声明的当前用户id
      currUserId:-1
    };
  },
  //在vue实例一创建就执行获取用户表格的数据
  created() {
    this.getTableData();
  },
  methods: {
    // 点击分配角色的对话框的确定按钮，做的事
    async setRole(){
       //参数介绍
       //id	用户 ID  这里的id携带在url中，在data中声明了，并且在某个方法里已经赋值
       //rid	角色 id  这个角色id是在请求体中的，但是已经在之前data中声明了
       const res=await this.$http.put(`users/${this.currUserId}/role`,{
         rid:this.currRoleId,
       });
       console.log(res);
      //  修改角色成功，关闭对话框
      this.dialogFormVisibleRole=false;
    },
    //点击分类角色的按钮的方法
    async showRoleDia(user) {
       //把用户id存储了
       this.currUserId=user.id;
       //当前用户名就在外层传来的数据user里面
       this.currUsername=user.username;
       //打开分配角色的对话框  
       this.dialogFormVisibleRole=true;
       //获取角色名称的请求
       const res=await this.$http.get(`roles`);
       console.log(res);
       const {meta:{msg,status},data}=res.data;
       if(status===200){
          //请求成功，赋值角色数组，这样角色下拉列表就有了数据
          this.roles=data;
       }
          //根据传进来的user数据里的id获取用户的角色id，并且与select的v-model绑定
          //这样一点开分配角色对话框，select绑定的角色id与option的value值(id值)匹配，就会自动显示对应option的lable值(角色名称)
          const res2=await this.$http.get(`users/${user.id}`);
          // 把获取的角色id赋值给select绑定的数据，这样就可以与option中的value值匹配，显示对应label值(角色名称)
          this.currRoleId=res2.data.data.rid;
    },
    //修改用户状态的方法
    async changeState(user) {
      console.log(user);
      //开关是一个表单，点击开关后，触发函数，然后输出传进来的user(上层传来的)
      //里面包含了用户id与用户状态，都是实时传递过来的，因为是表单嘛
      //uId 用户id   type改之后的用户状态  请求数据有了，就是user带过来的
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    // 点击编辑对话框中的确认按钮，触发的函数
    async editUser() {
      //点击编辑按钮，已将数据赋值给form，里面包含数据编辑的id，以及发送给后台的数据
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        //更新成功，关闭对话框，刷新表格
        this.dialogFormVisibleEdit = false;
        this.pagenum = 1;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 点击编辑按钮，弹出编辑对话框
    async showDiaEdit(user) {
      //打开对话框
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`users/${user.id}`);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        //获取数据成功，把data里的数据赋值给form，又因为form里的数据
        //正好与编辑对话框里的数据绑定了，所以数据正好填在编辑对话框里了
        this.form = data;
      }
    },
    // 点击删除按钮，执行的函数
    showDeleConfig(user) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 点击确认，发送请求
          const res = await this.$http.delete(`users/${user.id}`);
          console.log(res);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            //  重新刷新表格，但是需要从第一页展示数据
            this.pagenum = 1;
            this.getTableData();
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.warning("您已取消删除");
        });
    },
    // 点击添加对话框里的确认触发的函数
    async addUser() {
      // 1.获取表单里添加的值，发送添加请求
      const res = await this.$http.post(`users`, this.form);
      console.log(res.data);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 2.关闭对话框，并重新渲染表格数据
        this.dialogFormVisibleAdd = false;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 点击添加按钮，打开对话框，就是本是false的值变为true
    showDiaAdd() {
      // 但是需要每次打开对话框时，清空一次之前的数据
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 点击清空标志x，也可以重新获取数据(调用获取表格数据的方法)
    getAllUsers() {
      this.getTableData();
    },
    // 点击搜索按钮，搜索用户的方法，也是重调获取表格数据的方法，但是需重置页码为1，从第一页展示
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页相关方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      // 当每页显示数据条数发生改变时触发分页功能，改变当前页每页显示数据条数
      this.pagesize = val;
      //当前页数据条数发生改变后，最好回到第一页，然后再获取表格数据渲染
      this.pagenum = 1;
      //重新获取数据
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      // 当页码发生改变时，触发分页功能，改变当前页码
      this.pagenum = val;
      //重新获取表格数据进行渲染
      this.getTableData();
    },
    //获取用户列表的数据
    async getTableData() {
      //注意:请求之前，除了登录的接口，其他所有的接口都需要设置请求头信息，根据接口文档
      //查看axios文档如何设置请求头
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      //    query	查询参数	可以为空
      //    pagenum	当前页码	不能为空
      //    pagesize	每页显示条数	不能为空
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res.data);
      const {
        data: { total, users },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //获取数据成功，给表格数据源赋值
        this.tableData = users;
        console.log("表格数据");
        console.log(this.tableData);
        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>
