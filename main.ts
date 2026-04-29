/**
 * DFRobot RGB LCD Micro:bit Extension
 */

//% color="#209a97" icon="\uf110" block="RGB LCD"
namespace rgbLcd {
    // --- Constants ---
    const LCD_ADDRESS = (0x7c >> 1)
    const RGB_ADDRESS = (0xc0 >> 1)
    
    const REG_MODE1 = 0x00
    const REG_MODE2 = 0x01
    const REG_OUTPUT = 0x08
    const REG_RED = 0x04
    const REG_GREEN = 0x03
    const REG_BLUE = 0x02

    const LCD_CLEARDISPLAY = 0x01
    const LCD_RETURNHOME = 0x02
    const LCD_ENTRYMODESET = 0x04
    const LCD_DISPLAYCONTROL = 0x08
    const LCD_CURSORSHIFT = 0x10
    const LCD_FUNCTIONSET = 0x20
    const LCD_SETCGRAMADDR = 0x40
    const LCD_SETDDRAMADDR = 0x80

    const LCD_DISPLAYON = 0x04
    const LCD_CURSORON = 0x02
    const LCD_BLINKON = 0x01

    const LCD_ENTRYLEFT = 0x02
    const LCD_ENTRYSHIFTDECREMENT = 0x00

    const LCD_2LINE = 0x08
    const LCD_5x8DOTS = 0x00

    // --- State Variables ---
    let _showfunction = 0
    let _showcontrol = 0
    let _showmode = 0
    

    /**
     * Internal function to send I2C commands to the LCD
     */
    function command(value: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = 0x80
        buf[1] = value
        pins.i2cWriteBuffer(LCD_ADDRESS, buf)
    }

    /**
     * Internal function to write to RGB registers
     */
    function setReg(addr: number, data: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = addr
        buf[1] = data
        pins.i2cWriteBuffer(RGB_ADDRESS, buf)
    }

    /**
     * Initializes the LCD and RGB backlight
     */
    //% block="initialize LCD with %cols columns and %rows rows"
    export function init(cols: number, rows: number): void {
        _showfunction = LCD_FUNCTIONSET | LCD_5x8DOTS
        if (rows > 1) {
            _showfunction |= LCD_2LINE
        }

        // Wait for power up
        basic.pause(50)

        // Initialization sequence
        command(_showfunction)
        basic.pause(5)
        command(_showfunction)
        basic.pause(5)
        command(_showfunction)

        // Default display settings
        _showcontrol = LCD_DISPLAYON
        display()
        clear()

        // Entry mode
        _showmode = LCD_ENTRYLEFT | LCD_ENTRYSHIFTDECREMENT
        command(LCD_ENTRYMODESET | _showmode)

        // Backlight init
        setReg(REG_MODE1, 0)
        setReg(REG_OUTPUT, 0xFF)
        setReg(REG_MODE2, 0x20)
        setRGB(255, 255, 255) // Default White
    }

    /**
     * Clears the LCD screen
     */
    //% block="clear LCD"
    export function clear(): void {
        command(LCD_CLEARDISPLAY)
        basic.pause(2)
    }

    /**
     * Sets the cursor position
     */
    //% block="set cursor at col %col row %row"
    export function setCursor(col: number, row: number): void {
        col = (row == 0 ? col | 0x80 : col | 0xc0)
        let buf = pins.createBuffer(2)
        buf[0] = 0x80
        buf[1] = col
        pins.i2cWriteBuffer(LCD_ADDRESS, buf)
    }

    /**
     * Prints a string to the LCD
     */
    //% block="show string %s"
    export function showString(s: string): void {
        for (let i = 0; i < s.length; i++) {
            let buf = pins.createBuffer(2)
            buf[0] = 0x40
            buf[1] = s.charCodeAt(i)
            pins.i2cWriteBuffer(LCD_ADDRESS, buf)
        }
    }

    /**
     * Sets the backlight RGB color
     */
    //% block="set backlight color R %r G %g B %b"
    //% r.min=0 r.max=255 g.min=0 g.max=255 b.min=0 b.max=255
    export function setRGB(r: number, g: number, b: number): void {
        setReg(REG_RED, r)
        setReg(REG_GREEN, g)
        setReg(REG_BLUE, b)
    }

    /**
     * Turns on the display
     */
    //% block="turn display ON"
    export function display(): void {
        _showcontrol |= LCD_DISPLAYON
        command(LCD_DISPLAYCONTROL | _showcontrol)
    }

    /**
     * Turns off the display
     */
    //% block="turn display OFF"
    export function noDisplay(): void {
        _showcontrol &= ~LCD_DISPLAYON
        command(LCD_DISPLAYCONTROL | _showcontrol)
    }
}
