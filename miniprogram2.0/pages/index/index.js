
var app = getApp();
Page({
  //定义页面变量
  data: {
    input: '',
    input1: '',
    leftCount: 0,
    allCompleted: false,
    logs: [],
 todos:[]

  },
//保存方法，将todo-list和todo-logs保存在小程序本地，通过调用小程序开放api wx.setStorageSync（）
  save: function () {
    wx.setStorageSync('todo_list', this.data.todos)
    wx.setStorageSync('todo_logs', this.data.logs)
  },
//加载本地缓存中的todo-list
  load: function () {
    var todos = wx.getStorageSync('todo_list')
    if (todos) {
      var leftCount = todos.filter(function (item) {
        return !item.completed
      }).length
      this.setData({ todos: todos, leftCount: leftCount })
    }
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({ logs: logs })
    }
  },

  onLoad: function (options) {
    var that=this
    that.load();
    if (options.taskTitle){
    that.setData({
       input1:options.taskContain,
       input:options.taskTitle,
    })
    }
    else return
    if (!that.data.input || !that.data.input.trim()) return
    var todos = that.data.todos
    //将任务数据push到map中
    todos.push({ name: that.data.input, completed: false ,contain:that.data.input1})
    var logs = that.data.logs
    logs.push({ timestamp: new Date(), action: 'Add', name: that.data.input })
    that.setData({
      input: '',
      todos: todos,
      leftCount: that.data.leftCount + 1,
      logs: logs
    })
    that.save()
    
  },

  
//增加任务
  add: function (e) {

    wx.redirectTo({

      url: 'news/news',
    })
  },
 
 
//改变任务状态
  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed ? 'Finish' : 'Restart',
      name: todos[index].name
    })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
      logs: logs
    })
    this.save()
    
  },
//移除所有任务
  removeTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    var remove = todos.splice(index, 1)[0]
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Remove', name: remove.name })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
      logs: logs
    })
    this.save()
  },
//完成所有任务
  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted
    var todos = this.data.todos
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].completed = this.data.allCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All todos'
    })
    this.setData({
      todos: todos,
      leftCount: this.data.allCompleted ? 0 : todos.length,
      logs: logs
    })
    this.save()
  },

//查看任务详情
  detail:function(e){
    
    var value = e.currentTarget.id
     var todos = wx.getStorageSync('todo_list')
     var title=todos[value].name
     var contain=todos[value].contain
    wx.redirectTo({
      url: 'news/news?taskTitle=' + title+'&taskContain='+contain,
          })
    
    var todos = this.data.todos
    var remove = todos.splice(value, 1)[0]
  
    
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
     
    })
    this.save()
  },

//删除已经完成的任务
  clearCompletedHandle: function (e) {
    var todos = this.data.todos
    var remains = []
    for (var i = 0; i < todos.length; i++) {
      todos[i].completed || remains.push(todos[i])
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'Clear',
      name: 'Completed todo'
    })
    this.setData({ todos: remains, logs: logs })
    this.save()
  }
})
