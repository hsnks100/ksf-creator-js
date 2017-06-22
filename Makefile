JC = tsc
TARGET = result.js
OBJECTS = ksfinfo.ts main.ts test.ts

all : $(TARGET)

$(TARGET): $(OBJECTS)
	$(JC) -out $@ $^ 

clean :
	rm $(TARGET)
