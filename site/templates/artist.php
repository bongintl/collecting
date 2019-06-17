<!--
    
     
          '             .           .
       o       '   o  .     '   . O
    '   .   ' .   _____  '    .      .
     .     .   .mMMMMMMMm.  '  o  '   .
   '   .     .MMXXXXXXXXXMM.    .   ' 
  .       . /XX77:::::::77XX\ .   .   .
     o  .  ;X7:::''''''':::7X;   .  '
    '    . |::'.: BONG    '::| .   .  .
       .   ;:.:.            :;. o   .
    '     . \'.:            /.    '   .
       .     `.':.        .'.  '    .
     '   . '  .`-._____.-'   .  . '  .
      ' o   '  .   O   .   '  o    '
       . ' .  ' . '  ' O   . '  '   '
        . .   '    '  .  '   . '  '
         . .'..' . ' ' . . '.  . '
          `.':.'        ':'.'.'
            `\\_  |     _//'
              \(  |\    )/
              //\ |_\  /\\
             (/ /\(" )/\ \)
              \/\ (  ) /\/
                 |(  )|
                 | \( \
                 |  )  \
                 |      \
                 |       \
                 |        `.__,
                 \_________.-'Ojo/gnv
    
          http://bong.international/
    
-->

<!doctype html>
<html lang="en">
    
    <head>
        
        <meta charset="UTF-8">
        
        <title><?= $page -> title() ?> | Collecting Europe</title>
        
        <meta name="viewport" content="width=device-width, initial-scale=1 user-scalable=no">
        
        <?= css('style.css') ?>
        
    </head>


  
<?php 

    $id = $page -> shape_id(); 

    $no_blob = $page->hide_questions()->bool();
    
?>

    <body id="<?php if ($no_blob) { echo "no_blob"; } ?>">
        
    	<div class="landscape-prompt">
    		<span>Landscape please</span>
    	</div>
  
  <main class="main main_artist" data-params="<?php snippet('params', ['id' => $id] ); ?>">
    
    
    <section class="artist-header">
      
      <h1><?= $page -> title() ?></h1>
      
    </section>
    
    <!--<section class="grid grid_equal-height">-->
      
    <!--  <div class="grid__item grid__item_2 grid__item_title text-3">-->
        
    <!--    <span><?= $page -> work_title() ?></span>-->
      
    <!--  </div>-->
      
    <!--  <div class="grid__item grid__item_2 grid__item_title text-3">-->
      
    <!--    <span><?= $page -> location() ?></span>-->
      
    <!--  </div>-->
      
    <!--</section>-->
    
    <section class="grid">
        
        <div class="grid__item grid__item_1 grid__item_text">
            
            <div>
              
              <h2><?= $page -> work_title() ?></h2>
              
              <h2><?= $page -> location() ?></h2>
            
              <?= $page -> description() -> kirbytext() ?>
            </div>
            
        </div>
        
    </section>
    
    <?php foreach ( $page -> images() as $image ) : ?>
    
        <section class="grid">
            
            <div class="grid__item grid__item_1 grid__item_image">
                
                <img src="<?= $image -> url() ?>">
                
            </div>
            
        </section>
    
    <?php endforeach; ?>
    
    <section class="grid grid_equal-height">
      
      <div class="grid__item grid__item_2 grid__item_text">
        
        <div>
        
          <?= $page -> biography() -> kirbytext() ?>
        
        </div>
      
      </div>
      
      <div class="grid__item grid__item_2 grid__item_title text-3">
      
        <span>
          
            <?php foreach ( $page -> websites() -> toStructure() as $website ) : ?>
              
              <a class="ellipsis" href="<?= $website ?>" target="_blank">
                <?= str_replace( ['http://', 'https://'], '', $website ) ?>
              </a>
            
            <?php endforeach; ?>
            
        </span>
      
      </div>
      
    </section>
    
    <a class="button text-2" href="<?= $site -> url() ?>">Back</a>
    
  </main>

<?php snippet('footer') ?>