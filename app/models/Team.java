import java.util.ArrayList;

public class Team {

    static Player teamMember1;

    static Player teamMember2;

    int teamName;

    int runningScore;

    int roundScore;

    public Team() {
    }

    public Team(Player teamMember1, Player teamMember2, int teamName, int runningScore, int roundScore) {
        this.teamMember1 = teamMember1;
        this.teamMember2 = teamMember2;
        this.teamName = teamName;
        this.runningScore = runningScore;
        this.roundScore = roundScore;
    }

    public static Player getTeamMember1() {
        return teamMember1;
    }

    public void setTeamMember1(Player teamMember1) {
        this.teamMember1 = teamMember1;
    }

    public static Player getTeamMember2() {
        return teamMember2;
    }

    public void setTeamMember2(Player teamMember2) {
        this.teamMember2 = teamMember2;
    }

    public int getTeamName() {
        return teamName;
    }

    public void setTeamName(int teamName) {
        this.teamName = teamName;
    }

    public int getRunningScore() {
        return runningScore;
    }

    public void setRunningScore(int runningScore) {
        this.runningScore = runningScore;
    }

    public int getRoundScore() {
        return roundScore;
    }

    public void setRoundScore(int roundScore) {
        this.roundScore = roundScore;
    }

    public static ArrayList<Player> makeTeam(Player teamMember1, Player teamMember2) {
        ArrayList<Player> team = new ArrayList();
        team.add(teamMember1);
        team.add(teamMember2);

        return team;
    }

}