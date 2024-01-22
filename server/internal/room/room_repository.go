package room

import (
	"context"
	"database/sql"
)

type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type repository struct {
	db DBTX
}

func NewRepository(db DBTX) Repository {
	return &repository{db: db}
}

func (r *repository) CreateRoom(ctx context.Context, room *Room) (*Room, error) {
	var lastInsertId int
	query := "INSERT INTO rooms(id, name) VALUES ($1, $2) returning id"
	err := r.db.QueryRowContext(ctx, query, room.ID, room.Name).Scan(&lastInsertId)
	if err != nil {
		return &Room{}, err
	}

	room.ID = int64(lastInsertId)
	return room, nil
}

func (r *repository) GetRoomByID(ctx context.Context, roomID int64, roomName string) (*Room, error) {
	var room Room
	query := "SELECT id, name FROM rooms WHERE id = $1"
	err := r.db.QueryRowContext(ctx, query, roomID).Scan(&room.ID, &room.Name)
	if err != nil {
		return nil, err
	}

	return &room, nil
}

// func (r *repository) GetRoomById(ctx context.Context, roomID int64, name string) (*Room, error) {
// 	var room Room
// 	query := "SELECT id, name FROM rooms WHERE id = $1"
// 	err := r.db.QueryRowContext(ctx, query, roomID).Scan(&room.ID, &room.Name)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return &room, nil
// }
