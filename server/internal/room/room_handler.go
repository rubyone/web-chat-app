package room

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service
}

func NewHandler(s Service) *Handler {
	return &Handler{
		Service: s,
	}
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var u CreateRoomReq
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.Service.CreateRoom(c.Request.Context(), &u)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

// TODO: Implement GetRoomById

func (h *Handler) GetRoomById(c *gin.Context) {
	var r GetRoomReq
	log.Println("room1: ", r.ID, r.Name)

	roomID := c.Param("id")
	roomName := c.Param("name")

	log.Println("roomID: ", roomID)
	log.Println("roomName: ", roomName)

	// Convert roomID to int64
	roomIDInt, err := strconv.ParseInt(roomID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	room, err := h.Service.GetRoomByID(c.Request.Context(), roomIDInt, roomName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, room)
}
