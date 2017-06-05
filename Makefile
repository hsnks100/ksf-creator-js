JC = tsc
TARGET = result.js
OBJECTS = ksfinfo.ts main.ts 

all : $(TARGET)

$(TARGET): $(OBJECTS)
	$(JC) -out $@ $^ 

clean :
	rm *.o $(TARGET)
