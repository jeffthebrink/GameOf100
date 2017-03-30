import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;

public class Deck {
    private static ArrayList<Card> deck;

    public static void create() {
        deck.clear();
        for (int suit = 1; suit <= 4; suit++) {
            for (int rank = 1; rank <= 13; rank++) {
                deck.add(new Card(suit, rank));
            }
        }
        deck.add(new Card(0, 0));
        shuffle();
    }

    private static void shuffle() {
        long seed = System.nanoTime();
        Collections.shuffle(deck, new Random(seed));
    }

    public static Card dealOne() {
        Card card = deck.get(0);
        deck.remove(0);
        return card;
    }

    public static ArrayList<Card> dealMany(Integer many) {
        ArrayList<Card> cards = (ArrayList<Card>) deck.subList(0, many - 1);
        deck.removeAll(cards);
        return cards;
    }
}