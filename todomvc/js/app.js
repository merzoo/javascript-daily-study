(function (angular) {
	'use strict';
	/**
	* MyTodoMvc Module
	*
	* Description
	*/
	var app = angular.module('MyTodoMvc', [])
	app.controller('MainController', ['$scope', '$location', function($scope,$location){
		//文本框需要一个值
		$scope.text = '';
		//任务列表需要一个数组
		//每一个任务的结构{ id: 1, text: '学习', completed: true}
		$scope.todos = [
			{ id: Math.random(), text: '学习', completed: true},
			{ id: Math.random(), text: '睡觉', completed: false},
			{ id: Math.random(), text: '打豆豆', completed: false}
		];

		//选择器
		$scope.selector = {};
		$scope.$location = $location;

		//监视哈希值变化
		$scope.$watch('$location.path()', function(now, old){
			console.log(now);
			switch(now){
				case '/active':
					$scope.selector = {completed: false};
					break;
				case '/completed':
					$scope.selector = {completed: true};
					break;
				default:
					$scope.selector = {};
			}
		})

		//比较函数
		$scope.compare = function(source, target){
			console.log(source);
			console.log(target);
			return source === target;
		}

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
 			if($scope.text === ''){
 				return;
 			}

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
