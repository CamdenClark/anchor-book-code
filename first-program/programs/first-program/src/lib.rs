use anchor_lang::prelude::*;

declare_id!("9vsq2cQbWVLrwARj7aoYPWac5sauaGBXC4NLLB9Xgf1S");

#[program]
pub mod first_program {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
