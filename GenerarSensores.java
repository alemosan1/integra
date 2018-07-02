import java.io.*;
import java.util.Random;
import java.util.Date;

public class GenerarSensores {
	private PrintWriter out;

	String[] sensores = {"temperatura", "humedad"};
	Random randS = new Random();
	Random randV = new Random();

	int max_valor = 255;


	public GenerarSensores (String name) 
			throws FileNotFoundException {
		try {
			out= new PrintWriter(new FileWriter(name));
		} catch (Exception e) {
			System.out.println("Error");
		}
	}

	public void write(String l) {
		try {
			out.print(l);
			//		} catch (IOException e) {
		} catch (Exception e) {
			System.out.println("Error");
		}
	}

	public void cerrar () {
		try {
			out.close();
			//		} catch (IOException e) {
		} catch (Exception e) {
			System.out.println("Error");
		}
	}

	public String GenerarSensor() {

		String sensor;
		int valor;

		sensor = sensores[randS.nextInt(sensores.length)];
		valor  = randS.nextInt(max_valor);

		return sensor + " " + valor;

	}

	public static void main(String[] args) {

		

	      
	      
	      
		GenerarSensores escritor = null;
		try {
			escritor = new GenerarSensores("sensores.txt");//args[0]);
			//			escritor.write ("Hola \n");
			//			escritor.write ("A todos");


			for (int i = 1; i < 20; i++) {
//				escritor.write(escritor.GenerarSensor() + " " + 1 + " " + date.toString() + "\n");
				try {
					Thread.sleep(100);					
				} catch (Exception e) {
					// TODO: handle exception
				}
			      // Instantiate a Date object
			      Date date = new Date();
				escritor.write(escritor.GenerarSensor() + " " + 1 + " " + date.getTime() + "\n");

			}
			escritor.cerrar();
		} catch (FileNotFoundException e) {
			System.out.println ("No existe el fichero: " + args[0]);
		}


	}
}
