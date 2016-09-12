(function (angular) {
	'use strict';
	/**
	* MyTodoMvc Module
	*
	* Description
	*/
	var app = angular.module('MyTodoMvc', [])
	app.controller('MainController', ['$scope', function($scope){
		//文本框需要一个值
		$scope.text = '';
		//任务列表需要一个数组
		//每一个任务的结构{ id: 1, text: '学习', completed: true}
		$scope.todos = [
			{ id: Math.random(), text: '学习', completed: false},
			{ id: Math.random(), text: '睡觉', completed: false},
			{ id: Math.random(), text: '打豆豆', completed: false}
		];

		//双击编辑
		$scope.currentEditingId = -1;
		$scope.editing = function(todo){
			if(!todo.completed){
				$scope.currentEditingId = todo.id;
			}
		}

		//回车保存
		$scope.save = function(){
			$scope.currentEditingId = -1;
		}

		//添加todo
		$scope.add = function(){
			$scope.todos.push({
				id: Math.random(),
				text: $scope.text,
				completed: false
			});

			$scope.text = '';
		}

		//删除todo
		$scope.remove = function(todo){
			$scope.todos.splice($scope.todos.indexOf(todo), 1);
		}

		//全部删除completed
		$scope.clear = function(){
			var newArr = [];
			for(var i = 0; i < $scope.todos.length; i++){
				if(!$scope.todos[i].completed){
					newArr.push($scope.todos[i]);
				}
			}
			$scope.todos = newArr;
		}

		//是否有已经完成的
		$scope.exist = function(){
			for(var i = 0; i < $scope.todos.length; i++){
				if($scope.todos[i].completed){
					return true;
				}
			}
			return false;
		}
	}])

})(angular);
