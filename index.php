<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/estilos.css">
	<title>ScrapCT</title>
</head>
<body>
	<br><br>
	<div class="row">
		<div class="col-md-3 col-sm-12"></div>
		<div class="card col-md-6 col-sm-12 login">
			<form method="post" id="form-login">
				<h3>Iniciar sesión</h3>
				<label>
					Nombre de usario o correo
					<input type="text" name="correo" id="correo" class="form-control">
				</label>
				<br>
				<label>
					Contraseña
					<input type="password" name="contrasena" id="contrasena" class="form-control">
				</label>
				<br>
				<button type="button" class="btn btn-primary" id="button-login">Ingresar</button>
				<br><br>
			</form>
		</div>
	</div>

	<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>
    <script src="js/vendor/bootstrap.min.js"></script>
    <script src="js/notify.min.js"></script>
    <script src="js/usuario.js"></script>
</body>

</html>