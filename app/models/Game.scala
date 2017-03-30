import scala.collection.mutable
import scala.collection.mutable.ListBuffer

class Game {

  val player1 = new Player
  val player2 = new Player
  val player3 = new Player
  val player4 = new Player

  val bids = mutable.HashMap("player1" -> 0,
    "player2" -> 0,
    "player3" -> 0,
    "player4" -> 0)

  var cat: ListBuffer[Card]
  var currentBidder: Player = _
  var winningBidder: Player = _
  var winningBid: Int = 0

  var leader: Player = _
  var trump: Int = _
  var currentRound: Int = 1


  var allPlayers: ListBuffer[Player]
  allPlayers.+=(player1, player2, player3, player4)

  var activePlayers: ListBuffer[Player]
  activePlayers = allPlayers

  var playerTurn: Int = 2

  def changeTurns(): Unit = {
    if (playerTurn < 4) {
      playerTurn += 1
    } else {
      playerTurn = 1
    }
  }

  def verifyTurn(player: Player): Boolean = {
    player.playerName == playerTurn
  }

  def deal(): Unit = {
    Deck.create()
    player1.setHand(Deck.dealMany(12))
    player2.setHand(Deck.dealMany(12))
    player3.setHand(Deck.dealMany(12))
    player4.setHand(Deck.dealMany(12))
    Deck.dealMany(5).forEach(card => cat += card)
  }

  def evaluateBid(currentBidder: Player, bid: Int): Unit = {
    if (verifyTurn(currentBidder)) {
      if (bid > winningBid) {
        winningBid = bid
        winningBidder = currentBidder
      }
      if (bid == -1) {
        activePlayers.-=(currentBidder)
      }
      changeTurns()
    }
  }

  def setTrump(passedTrump: Int): Unit = {
    trump = passedTrump
  }

  def checkIfTrump(c: Card): Boolean = {
    trump == c.suit

  }

  def passCards(cards: ListBuffer[Card], targetPlayer: Player): Unit = {
    targetPlayer.addToHand(cards)
  }

  def discard(player: Player, cards: ListBuffer[Card]): Unit = {
    if (!cards.forall(card => checkIfTrump(card))) {
      for (card <- cards if cards.size > 6 && card.suit != trump)
        cards -= card
    }

  }
}
