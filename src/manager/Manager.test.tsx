/// <reference types="@vitest/browser/context" />
import { GameSettings, Save } from '@/storage/types'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { Manager } from '@/manager/Manager'

const now = new Date()
const generateSave = (
  name: string,
  minutesAgo: number,
  data: string,
): Save => ({
  name,
  timestamp: new Date(now.getTime() - 1000 * 60 * minutesAgo).getTime(),
  data,
})

const getGames = () => screen.getAllByTestId('game')
const getSaves = () => within(getGames()[0]).getAllByTestId('save')

describe('Manager', () => {
  beforeEach(async () => {
    await chrome.storage.local.clear()
    const settings: Record<string, GameSettings> = {
      'https://game1.com': {
        dataType: 'any',
        enabled: true,
        favicon: '',
        showFavicon: true,
        name: 'Example game',
        saves: [
          generateSave('Save 1', 5, 'data1'),
          generateSave('Save 2', 10, 'data2'),
          generateSave('Save 3', 15, 'data3'),
        ],
        url: 'https://game1.com',
      },
      'http://game2.com': {
        dataType: 'json',
        enabled: false,
        favicon: '',
        showFavicon: true,
        name: 'Game 2',
        saves: [],
        url: 'http://game2.com',
      },
    }
    await chrome.storage.local.set(settings)
    render(<Manager />)
  })

  it('renders correctly', () => {
    screen.getByText('Manage saves')
    const games = getGames()
    expect(games.length).toBe(2)
    expect(games[0]).toHaveTextContent('Example game')
    expect(games[1]).toHaveTextContent('Game 2')
  })

  it('shows no games found when there are no games', async () => {
    act(() => {
      chrome.storage.local.clear()
    })
    screen.getByText('No games found. Add a game to manage saves.')
    screen.getByText(
      'Go to a page with a game, click the extension icon and turn it on to add a game',
    )
  })

  describe('game settings', () => {
    it('toggles game enabled/disabled state', async () => {
      const games = getGames()
      const toggle = within(games[1]).getByRole('switch')
      expect(toggle).toHaveAttribute('aria-checked', 'false')
      fireEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-checked', 'true')
      const settings = await chrome.storage.local.get('https://game1.com')
      expect(settings['https://game1.com'].enabled).toBe(true)
      fireEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-checked', 'false')
    })

    it('removes a game', async () => {
      fireEvent.click((await screen.findAllByTitle('Remove game'))[1])
      await screen.findByText('Are you sure you want to delete "Game 2"?')
      fireEvent.click(await screen.findByText('Confirm'))
      expect(screen.getByText('Example game')).toBeInTheDocument()
      const notExisting = screen.queryByText('Game 2')
      expect(notExisting).not.toBeInTheDocument()
    })

    it('expands/collapses game saves', async () => {
      const game = within(getGames()[0])
      const toggle = game.getByTestId('toggle-saves')
      expect(screen.queryByText('Save 3')).not.toBeInTheDocument()
      fireEvent.click(toggle)
      expect(screen.getByText('Save 3')).toBeInTheDocument()
      fireEvent.click(toggle)
      expect(screen.queryByText('Save 3')).not.toBeInTheDocument()
    })

    it('renames a game', async () => {
      const game = within(getGames()[1])
      expect(game.getByText('Game 2')).toBeInTheDocument()
      const renameButton = game.getByTitle('Edit title')
      fireEvent.click(renameButton)
      const input = game.getByDisplayValue('Game 2')
      expect(input).toBeInTheDocument()
      fireEvent.change(input, { target: { value: 'New Game 2' } })
      expect(input).toHaveAttribute('value', 'New Game 2')
      fireEvent.click(game.getByTitle('Save name'))
      expect(screen.queryByText('New Game 2')).toBeInTheDocument()
      expect(screen.queryByText('Game 2')).not.toBeInTheDocument()
    })

    it('cancels renaming', async () => {
      const game = within(getGames()[1])
      expect(game.getByText('Game 2')).toBeInTheDocument()
      const renameButton = game.getByTitle('Edit title')
      fireEvent.click(renameButton)
      const input = game.getByDisplayValue('Game 2')
      expect(input).toBeInTheDocument()
      fireEvent.change(input, { target: { value: 'New Game 2' } })
      expect(input).toHaveAttribute('value', 'New Game 2')
      fireEvent.click(game.getByTitle('Cancel'))
      expect(screen.queryByText('Game 2')).toBeInTheDocument()
      expect(screen.queryByText('New Game 2')).not.toBeInTheDocument()
    })

    it('edits a URL', async () => {
      const game = within(getGames()[0])
      expect(game.getByText('https://game1.com')).toBeInTheDocument()
      const editButton = game.getByTitle('Edit URL')
      fireEvent.click(editButton)
      const input = game.getByDisplayValue('https://game1.com')
      expect(input).toBeInTheDocument()
      fireEvent.change(input, { target: { value: 'http://new-url.com' } })
      expect(input).toHaveAttribute('value', 'http://new-url.com')
      fireEvent.click(game.getByTitle('Save URL'))
      expect(screen.queryByText('http://new-url.com')).toBeInTheDocument()
      expect(screen.queryByText('https://game1.com')).not.toBeInTheDocument()
    })

    it('cancels editing URL', async () => {
      const game = within(getGames()[0])
      expect(game.getByText('https://game1.com')).toBeInTheDocument()
      const editButton = game.getByTitle('Edit URL')
      fireEvent.click(editButton)
      const input = game.getByDisplayValue('https://game1.com')
      expect(input).toBeInTheDocument()
      fireEvent.change(input, { target: { value: 'http://new-url.com' } })
      expect(input).toHaveAttribute('value', 'http://new-url.com')
      fireEvent.click(game.getByTitle('Cancel'))
      expect(screen.queryByText('https://game1.com')).toBeInTheDocument()
      expect(screen.queryByText('http://new-url.com')).not.toBeInTheDocument()
    })
  })

  describe('saves', () => {
    beforeEach(() => {
      const game = within(getGames()[0])
      const toggle = game.getByTestId('toggle-saves')
      fireEvent.click(toggle)
    })

    it('shows all saves', async () => {
      const saves = getSaves()

      expect(saves.length).toBe(3)
      expect(saves[0]).toHaveTextContent('Save 1')
      expect(saves[0]).toHaveTextContent('5 minutes ago')
      expect(saves[1]).toHaveTextContent('Save 2')
      expect(saves[1]).toHaveTextContent('10 minutes ago')
      expect(saves[2]).toHaveTextContent('Save 3')
      expect(saves[2]).toHaveTextContent('15 minutes ago')
    })

    it('shows save data', async () => {
      const saves = getSaves()
      const save = within(saves[0])
      expect(save.queryByText('data1')).not.toBeInTheDocument()
      fireEvent.click(save.getByTitle('Show data'))
      expect(save.queryByText('data1')).toBeInTheDocument()
      fireEvent.click(save.getByTitle('Hide data'))
      expect(save.queryByText('data1')).not.toBeInTheDocument()
    })

    it('renames a save', async () => {
      const saves = getSaves()

      const save = within(saves[2])
      fireEvent.click(save.getByTitle('Rename save'))
      const input = save.getByDisplayValue('Save 3')
      expect(input).toBeInTheDocument()
      fireEvent.change(input, { target: { value: 'New Save 3' } })
      expect(input).toHaveAttribute('value', 'New Save 3')
      fireEvent.click(save.getByTitle('Save name'))
      expect(screen.queryByText('New Save 3')).toBeInTheDocument()
      expect(screen.queryByText('Save 3')).not.toBeInTheDocument()
      // all other saves should still be there
      expect(screen.queryByText('Save 1')).toBeInTheDocument()
      expect(screen.queryByText('Save 2')).toBeInTheDocument()
    })

    it('cancels renaming', async () => {
      const saves = getSaves()
      const save = within(saves[0])
      fireEvent.click(save.getByTitle('Rename save'))
      const input = save.getByDisplayValue('Save 1')
      expect(input).toBeInTheDocument()
      fireEvent.change(input, { target: { value: 'New Save 1' } })
      expect(input).toHaveAttribute('value', 'New Save 1')
      fireEvent.click(save.getByTitle('Cancel'))
      expect(screen.queryByText('Save 1')).toBeInTheDocument()
      expect(screen.queryByText('New Save 1')).not.toBeInTheDocument()
    })

    it('removes a save', async () => {
      const saves = getSaves()
      const save = within(saves[1])
      fireEvent.click(save.getByTitle('Remove save'))
      await screen.findByText(
        'Are you sure you want to delete the save "Save 2"? This action cannot be undone.',
      )
      fireEvent.click(await screen.findByText('Confirm'))
      expect(screen.queryByText('Save 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Save 1')).toBeInTheDocument()
      expect(screen.queryByText('Save 3')).toBeInTheDocument()
    })
  })
})
