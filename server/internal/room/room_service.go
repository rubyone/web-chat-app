package room

import (
	"context"
	"errors"
	"log"
)

type service struct {
	Repository
}

func NewService(repository Repository) Service {
	return &service{
		repository,
	}
}

func (s *service) CreateRoom(ctx context.Context, req *CreateRoomReq) (*CreateRoomRes, error) {
	// Implement your logic to create a new room in the database
	// You can use the provided context for any database operations

	r := &Room{
		ID:   req.ID,
		Name: req.Name,
	}

	r, err := s.Repository.CreateRoom(ctx, r)
	if err != nil {
		return nil, err
	}

	res := &CreateRoomRes{
		ID:   int64(r.ID),
		Name: r.Name,
	}

	// Save the room to the database

	return res, nil
}

func (s *service) GetRoomByID(ctx context.Context, id int64, name string) (*Room, error) {
	// Implement your logic to retrieve a room by its ID from the database
	// You can use the provided context for any database operations

	// Example implementation:
	room := &Room{
		ID:   id,
		Name: name,
	}
	log.Println("room: ", room)
	// Retrieve the room from the database

	if room == nil {
		return nil, errors.New("room not found")
	}

	return room, nil
}

// // Add more methods as needed for your room service
