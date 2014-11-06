<?php

	class Parser{
		public static function parse(){
			$ch = curl_init(); 

			curl_setopt($ch, CURLOPT_URL, "api.thejournal.ie/v3/sample/thejournal"); 
			curl_setopt($ch, CURLOPT_USERPWD, "sample:");
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

			$output = curl_exec($ch); 

			curl_close($ch);

			header('Content-Type: application/json');

			return $output;
		}
	}

	$json = Parser::parse();
	echo $json;
?>
