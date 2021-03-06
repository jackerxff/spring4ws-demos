package ch.rasc.s4ws.tennis;

public class Player {

	private final String name;

	private final String country;

	private int sets = 0;

	private int set1 = 0;

	private int set2 = 0;

	private int set3 = 0;

	private int gamesInCurrentSet = 0;

	public Player(String name, String country) {
		this.name = name;
		this.country = country;
	}

	public synchronized void reset() {
		sets = 0;
		set1 = set2 = set3 = 0;
		gamesInCurrentSet = 0;
	}

	public int getSets() {
		return sets;
	}

	public void incSets() {
		sets++;
	}

	public void setSets(int sets) {
		this.sets = sets;
	}

	public int getSet1() {
		return set1;
	}

	public void setSet1(int set1) {
		this.set1 = set1;
	}

	public int getSet2() {
		return set2;
	}

	public void setSet2(int set2) {
		this.set2 = set2;
	}

	public int getSet3() {
		return set3;
	}

	public void setSet3(int set3) {
		this.set3 = set3;
	}

	public int getGamesInCurrentSet() {
		return gamesInCurrentSet;
	}

	public void incGamesInCurrentSet() {
		gamesInCurrentSet++;
	}

	public void setGamesInCurrentSet(int gamesInCurrentSet) {
		this.gamesInCurrentSet = gamesInCurrentSet;
	}

	public String getName() {
		return name;
	}

	public String getCountry() {
		return country;
	}

}