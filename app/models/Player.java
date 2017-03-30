import java.util.ArrayList;

public class Player {

    ArrayList<Card> playersHand = new ArrayList<>();

    int playerName; // indicates player 1, player 2, etc...

    int bid;

    Player teammate;

    public Player() {
    }

    public Player(ArrayList<Card> playersHand, int playerName, int bid, Player teammate) {
        this.playersHand = playersHand;
        this.playerName = playerName;
        this.bid = bid;
        this.teammate = teammate;
    }

    public ArrayList<Card> getHand() {
        return playersHand;
    }

    public void setHand(ArrayList<Card> playersHand) {
        this.playersHand = playersHand;
    }

    public int getPlayerName() {
        return playerName;
    }

    public void setPlayerName(int playerName) {
        this.playerName = playerName;
    }

    public int getBid() {
        return bid;
    }

    public void setBid(int bid) {
        this.bid = bid;
    }

    public Player getTeammate() {
        return teammate;
    }

    public void setTeammate(Player teammate) {
        this.teammate = teammate;
    }

    public void addCatToHand(ArrayList<Card> cat) {
        playersHand.addAll(cat);
    }

    public void passCards(ArrayList<Card> passedCards) {
        playersHand.removeAll(passedCards);
    }

    public void takeCards(ArrayList<Card> passedCards) {
        playersHand.addAll(passedCards);
    }

    public void addCard( Card card) {
        playersHand.add(card);
    }

    //method to handle when players discard from original hand of 12 down to 6 card-->activeHand
    //cards discarded are simply deleted (go to garbage pile)
    public void discardCard(Card card) {
        playersHand.remove(card);
    }

    //method to handle when a player lays down a card to play during active round of play-->card returned will go into the Trick
    //class
    public Card playCard(Player player, Card card) {
        playersHand.remove(card);
        return card;
    }
}