import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Collision Detection

Your game is progressing nicely. Only two more things and you're done: Growing the snake and "Game Over". For the first, you need to check if the snake collides with the fruit. For the second, you need to check if the snake collides with itself.

## Collision Detection with the Fruit

Collision detection can be one of the harder to understand concepts of game development. Lucky for you, this is not the case this time. This game is using a 20x20 grid. Each cell can either be occupied or free. To check this, you can compare the X and Y values of the 2 entities that are checked.

<Tabs
    groupId="code-language"
    defaultValue="language-typescript"
    values={[
        {label: 'AssemblyScript', value: 'language-typescript'},
        {label: 'C / C++', value: 'language-cpp'},
        {label: 'Rust', value: 'language-rust'},
        {label: 'Go', value: 'language-go'},
        {label: 'Zig', value: 'language-zig'},
    ]}>

<TabItem value="language-typescript">

A simple

```typescript
if (snake.body[0].equals(fruit)) {
    // Snake's head hits the fruit
}
```

is enough already to check if the snake eats the fruit. And to make the snake "grow", simply increase the length of the snake using the `push` function of the array. Now it remains the question what values should this new piece have. The easiest would be to add the current last piece:

```typescript
let tail = snake.body[snake.body.length - 1]
snake.body.push(new Point(tail.x, tail.y))
```

Once this done, simply relocate the fruit:

```go
fruit.X = rnd(20)
fruit.Y = rnd(20)
```

In it's final form, it could look like this:

```typescript {4-9}
    if (frameCount % 15 == 0) {
        snake.update()

        if (snake.body[0].equals(fruit)) {
            let tail = snake.body[snake.body.length - 1]
            snake.body.push(new Point(tail.x, tail.y))
            fruit.x = rnd(20)
            fruit.y = rnd(20)
        }
    }
```

Now you're almost done. Only "Game Over" is left to finish this game.

</TabItem>

<TabItem value="language-cpp">

// TODO

</TabItem>

<TabItem value="language-rust">

// TODO

</TabItem>

<TabItem value="language-go">

 A simple

```go
if snake.Body[0].X == fruit.X && snake.Body[0].Y == fruit.Y {
	// Snake's head hits the fruit
}
```

is enough already to check if the snake eats the fruit. And to make the snake "grow", simply increase the length of the snake using the `append` function of Go. Now it remains the question what values should this new piece have. The easiest would be to add the current last piece:

```go
snake.Body = append(snake.Body, snake.Body[len(snake.Body)-1])
```

Once this done, simply relocate the fruit:

```go
fruit.X = rnd(20)
fruit.Y = rnd(20)
```

In it's final form, it could look like this:

```go {4-8}
	if frameCount%15 == 0 {
		snake.Update()

		if snake.Body[0].X == fruit.X && snake.Body[0].Y == fruit.Y {
			snake.Body = append(snake.Body, snake.Body[len(snake.Body)-1])
			fruit.X = rnd(20)
			fruit.Y = rnd(20)
		}
	}
```

Now you're almost done. Only "Game Over" is left to finish this game.

</TabItem>

<TabItem value="language-zig">

A simple

```zig
if (snake.body.get(0).equals(fruit)) {
    // Snake's head hits the fruit
}
```

is enough already to check if the snake eats the fruit. And to make the snake "grow", simply increase the length of the snake using the `push` function of the array. Now it remains the question what values should this new piece have. The easiest would be to add the current last piece:

```zig
var tail = snake.body.get(snake.body.len-1);
snake.body.append(Point.init(tail.x, tail.y)) catch @panic("couldn't grow snake");
```

Once this done, simply relocate the fruit:

```zig
fruit.x = rnd(20);
fruit.y = rnd(20);
```

In it's final form, it could look like this:

```zig {4-9}
    if (frameCount % 15 == 0) {
        snake.update()

        if (snake.body[0].equals(fruit)) {
            let tail = snake.body[snake.body.length - 1]
            snake.body.push(new Point(tail.x, tail.y))
            fruit.x = rnd(20)
            fruit.y = rnd(20)
        }
    }
```

Now you're almost done. Only "Game Over" is left to finish this game.

</TabItem>

</Tabs>

## Collision Detection with Itself

For the player to have any sense of "danger", the game needs a possibility for the player to lose. Usually the snake can't touch itself or it dies. For this, just loop through the body and check if the piece and the head have the same coordinates. Just like with the fruit. But it might be a good idea to move this to it's own function:

<Tabs
    groupId="code-language"
    defaultValue="language-typescript"
    values={[
        {label: 'AssemblyScript', value: 'language-typescript'},
        {label: 'C / C++', value: 'language-cpp'},
        {label: 'Rust', value: 'language-rust'},
        {label: 'Go', value: 'language-go'},
        {label: 'Zig', value: 'language-zig'},
    ]}>

<TabItem value="language-typescript">

```typescript
    isDead(): bool {
        const head = this.body[0]
        for (let i = 1, len = this.body.length; i < len; i++) {
            if (this.body[i].equals(head)) {
                return true
            }
        }

        return false
    }
```

Now you can call this function to check if the snake died in this frame:

```typescript {4-6}
    if (frameCount % 15 == 0) {
        snake.update()

        if (snake.isDead()) {
            // Do something
        }

        if (snake.body[0].equals(fruit)) {
            let tail = snake.body[snake.body.length - 1]
            snake.body.push(new Point(tail.x, tail.y))
            fruit.x = rnd(20)
            fruit.y = rnd(20)
        }
    }
```

What you do, is up to you. You could stop the game and show the score. Or you could simply reset the game. Up to you.

</TabItem>

<TabItem value="language-cpp">

// TODO

</TabItem>

<TabItem value="language-rust">

// TODO

</TabItem>

<TabItem value="language-go">

```go
func (s *Snake) IsDead() bool {
	for index := 1; index < len(s.Body)-1; index++ {
		if s.Body[0].X == s.Body[index].X && s.Body[0].Y == s.Body[index].Y {
			return true
		}
	}

	return false
}
```

Now you can call this function to check if the snake died in this frame:

```go {4-6}
	if frameCount%15 == 0 {
		snake.Update()

		if snake.IsDead() {
			// Do something
		}

		if snake.Body[0].X == fruit.X && snake.Body[0].Y == fruit.Y {
			snake.Body = append(snake.Body, snake.Body[len(snake.Body)-1])
			fruit.X = rnd(20)
			fruit.Y = rnd(20)
		}
	}
```

What you do, is up to you. You could stop the game and show the score. Or you could simply reset the game. Up to you.

</TabItem>

<TabItem value="language-zig">

```zig
    pub fn isDead(this: @This()) bool {
        const head = this.body.get(0);
        for (this.body.constSlice()) |part, i| {
            if (i == 0) continue;
            if (part.equals(head)) return true;
        }

        return false;
    }
```

Now you can call this function to check if the snake died in this frame:

```zig {4-6}
    if (frameCount % 15 == 0) {
        snake.update()

        if (snake.isDead()) {
            // Do something
        }

        if (snake.body[0].equals(fruit)) {
            let tail = snake.body[snake.body.length - 1]
            snake.body.push(new Point(tail.x, tail.y))
            fruit.x = rnd(20)
            fruit.y = rnd(20)
        }
    }
```

What you do, is up to you. You could stop the game and show the score. Or you could simply reset the game. Up to you.

</TabItem>

</Tabs>
