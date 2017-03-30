////class to manage the cards a player holds. Will start at 12 cards and must be able to update to 17 for the bid
////winner. Then will cut down to 6 cards for each player at the start of the game. Each round will decrease
////each player's hand by 1. 4 cards played go into 'Trick' class. When every player's hand = 0, round is over.
//
//
//import java.util.ArrayList;
//
//
//public class Hand {
//
//    static ArrayList<Card> playersHand = new ArrayList<>();
//
//
//    public void addCard( Card card) {
//
//        playersHand.add(card);
//    }
//
//    //method to handle when players discard from original hand of 12 down to 6 card-->activeHand
//    //cards discarded are simply deleted (go to garbage pile)
//    public void discardCard(Card card) {
//
//        playersHand.remove(card);
//
//    }
//
//    //method to handle when a player lays down a card to play during active round of play-->card returned will go into the Trick
//    //class
//    public Card playCard(Player player, Card card) {
//
//           playersHand.remove(card);
//
//           return card;
//
//    }
//
//
//
//}
