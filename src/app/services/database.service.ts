import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

export interface IGame {
  category: string;
  difficulty: string;
  score: number;
  total_question: number;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  // Proprieté de connexion Sqlite
  private sqliteConnection!: SQLiteConnection;
  // Propriété de connexion a la DB
  private db!: SQLiteDBConnection;
  // Flag de readiness de la DB
  private isReady: boolean = false;

  constructor() {
    this.initDatabase;
  }

  async initDatabase() {
    try {
      // Initialise la connexion Sqlite grace a capacitor
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
      // Paramètres : Nom de la DB, encryption, mode de fonctionnement, version, readOnly
      this.db = await this.sqliteConnection.createConnection(
        'quiz',
        false,
        'no-encryption',
        1,
        false
      );
      // une fois la connection effective, on ouvre la connexion à la db
      await this.db.open();

      await this.createTables();

      this.isReady = true;
    } catch (error) {
      console.error(
        `Erreur de l'initialisation de la base de donnée SQLite : ${error}`
      );
    }
  }

  // Méthode de la création des differentes tables de la DB
  private async createTables() {
    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
       total_games INTEGER,
        total_correct INTEGER
        )`
    );

    await this.db.execute(`CREATE TABLE IF NOT EXISTS game_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      difficulty TEXT,
      score INTEGER,
      total_questions INTEGER,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
  }

  // Ajout d'une partie jouée dans la db
  async addToHistory(game: IGame) {
    // Si la db n'est pas prête (initialisée, connectéé,...) on attend simplement qu'elle le soit
    if (!this.isReady) {
      await this.initDatabase();
    }
    // Création d'une requête pour injecter dans la db les informations de la partie (IGame)
    // Les `` (back ticks) définissent le scope de la requête et permet l'insertion des valeurs litérals ${}
    // les valeurs literales entourées de '' (single quotes) sont des chaines de caractères
    // les "" (guillemets) ne fonctionne pas
    const query = `INSERT INTO game_history (category, difficulty, score, total_questions)
    VALUES ('${game.category}', '${game.difficulty}', ${game.score}, ${game.total_question})`;

    return await this.db.execute(query);
  }

  async getHistory() {
    if (!this.isReady) {
      await this.initDatabase();
    }

    return await this.db.query(`SELECT * FROM game_history ORDER BY date DESC`);
  }
}
