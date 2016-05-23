

var login = new Vue({
	el: 'body',
	data: {
		loginName:'',
		loginPassword:'',
		registName:'',
		registPassword:'',
		registInfo:''
	},
	methods:{
		loginModal: function(){
			console.log("# showModal: "+this.loginName+' '+this.loginPassword);
			
			var data = {};
			data.username = this.loginName;
			data.password = this.loginPassword;
			
			$.ajax({
				type: 'POST',
				data: data,
		        url: '/login',
		        success: function(result) {
		            // console.log(JSON.stringify(result));
	            	swal({
	            		title: "Login Success!",
	            		text: "OK",//JSON.stringify(result),
	            		type: "success",
	            		confirmButtonText: "OK" 
	            	},function(){
	            		location.reload();
	            	});
		        },
		        error: function(result){
		        	console.log(JSON.stringify(result));
		        	swal({
	            		title: "Login Error!",
	            		text: "Unauthorized",
	            		type: "error",
	            		confirmButtonText: "OK" 
	            	},function(){
	            		location.reload();
	            	});
		        }
		    });
		},
		registModal: function(){
			console.log("# showModal: "+this.registName+' '+this.registPassword+' '+this.registInfo);
			
			var data = {};
			data.username = this.registName;
			data.password = this.registPassword;
			data.info = this.registInfo;
			
			$.ajax({
				type: 'POST',
				data: data,
		        url: '/register',
		        success: function(result) {
		            // console.log(JSON.stringify(result));
	            	swal({
	            		title: "Regist Success!",
	            		text: "OK",//JSON.stringify(result),
	            		type: "success",
	            		confirmButtonText: "OK" 
	            	},function(){
	            		location.reload();
	            	});
		        },
		        error: function(result){
		        	console.log(JSON.stringify(result));
		        	swal({
	            		title: "Regist Error!",
	            		text: "Failed",
	            		type: "error",
	            		confirmButtonText: "OK" 
	            	},function(){
	            		location.reload();
	            	});
		        }
		    });
		}
	},
	ready: function(){
		$('.modal-trigger').leanModal({
			dismissible: true
		});
	}
});
